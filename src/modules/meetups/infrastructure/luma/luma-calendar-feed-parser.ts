import type { LumaCalendarFeedEventDto } from './luma.dto'

const FOLDED_LINE_PATTERN = /\r?\n[ \t]/g
const LINE_BREAK_PATTERN = /\r?\n/
const PROPERTY_NAME_END_PATTERN = /[;:]/
const ESCAPED_TEXT_PATTERN = /\\([nN,;\\])/g
const UTC_DATE_TIME_PATTERN = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/
const EVENT_START_LINE = 'BEGIN:VEVENT'
const EVENT_END_LINE = 'END:VEVENT'
const VALUE_SEPARATOR = ':'
const QUOTE = '"'

const ESCAPED_TEXT_CHARACTERS: Record<string, string> = {
  n: '\n',
  N: '\n',
  ',': ',',
  ';': ';',
  '\\': '\\',
}

type FeedEventProperties = Map<string, string>

export class LumaCalendarFeedParser {
  static parse(calendarFeed: string): LumaCalendarFeedEventDto[] {
    return LumaCalendarFeedParser.parseEventProperties(calendarFeed)
      .map(properties => LumaCalendarFeedParser.toFeedEvent(properties))
      .filter((event): event is LumaCalendarFeedEventDto => event !== null)
  }

  private static parseEventProperties(calendarFeed: string): FeedEventProperties[] {
    const lines = calendarFeed.replace(FOLDED_LINE_PATTERN, '').split(LINE_BREAK_PATTERN)
    const events: FeedEventProperties[] = []
    let currentEvent: FeedEventProperties | null = null

    for (const line of lines) {
      if (line === EVENT_START_LINE) {
        currentEvent = new Map()
      } else if (line === EVENT_END_LINE && currentEvent) {
        events.push(currentEvent)
        currentEvent = null
      } else if (currentEvent) {
        addProperty(currentEvent, line)
      }
    }

    return events
  }

  private static toFeedEvent(properties: FeedEventProperties): LumaCalendarFeedEventDto | null {
    const uid = properties.get('UID')
    const summary = properties.get('SUMMARY')
    const startsAt = toIsoDateTime(properties.get('DTSTART'))

    if (!uid || !summary || !startsAt) {
      return null
    }

    return {
      uid,
      summary: unescapeText(summary),
      startsAt,
      endsAt: toIsoDateTime(properties.get('DTEND')),
      description: toOptionalText(properties.get('DESCRIPTION')),
      location: toOptionalText(properties.get('LOCATION')),
      status: properties.get('STATUS') ?? null,
    }
  }
}

function addProperty(properties: FeedEventProperties, line: string): void {
  const nameEnd = line.search(PROPERTY_NAME_END_PATTERN)
  const valueStart = findValueSeparator(line, nameEnd)

  if (nameEnd > 0 && valueStart > 0) {
    properties.set(line.slice(0, nameEnd).toUpperCase(), line.slice(valueStart + 1))
  }
}

function findValueSeparator(line: string, from: number): number {
  let isInsideQuotes = false

  for (let index = Math.max(from, 0); index < line.length; index++) {
    if (line[index] === QUOTE) isInsideQuotes = !isInsideQuotes
    if (line[index] === VALUE_SEPARATOR && !isInsideQuotes) return index
  }

  return -1
}

function unescapeText(value: string): string {
  return value.replace(ESCAPED_TEXT_PATTERN, (_match, character: string) => ESCAPED_TEXT_CHARACTERS[character])
}

function toOptionalText(value: string | undefined): string | null {
  return value ? unescapeText(value).trim() || null : null
}

function toIsoDateTime(value: string | undefined): string | null {
  const parts = value ? UTC_DATE_TIME_PATTERN.exec(value) : null
  if (!parts) {
    return null
  }

  const [, year, month, day, hours, minutes, seconds] = parts
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
}
