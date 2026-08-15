import { Datetime } from '@/shared/domain/datetime/datetime'
import type { OteEvent, OteFeed } from './ote-event'

/**
 * Serializa un feed OTE como iCalendar (RFC 5545), suscribible desde cualquier
 * calendario.
 *
 * Las fechas se emiten como instantes UTC (`...Z`) en vez de con `TZID`, igual
 * que hace `generate-ics.ts` para los emails: evita tener que emitir un
 * componente `VTIMEZONE` por zona y es inequívoco para cualquier consumidor.
 * Asume que los eventos traen hora (el dominio siempre la tiene); OTE admite
 * además eventos de día completo, que aquí no se dan.
 */
export function oteFeedToIcs(feed: OteFeed): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventosWiki//EventosWiki//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(feed.title ?? 'eventos.wiki')}`,
    ...(feed.description ? [`X-WR-CALDESC:${escapeIcsText(feed.description)}`] : []),
    ...feed.events.flatMap(event => toVEvent(event, feed)),
    'END:VCALENDAR',
  ]

  return lines.map(fold).join('\r\n')
}

function toVEvent(event: OteEvent, feed: OteFeed): string[] {
  const location = [event.location?.venue, event.location?.address?.street, event.location?.onlineUrl]
    .filter(Boolean)
    .join(', ')

  // iCal solo admite un ORGANIZER, y su valor tiene que ser una CAL-ADDRESS.
  // Sin email no hay dirección válida que poner, así que se omite en vez de
  // inventar un URI de relleno que los parsers estrictos rechazarían.
  const organizer = [event.organizers?.[0], feed.organizers?.[0]].find(candidate => candidate?.email)

  return [
    'BEGIN:VEVENT',
    `UID:${event.id}`,
    `DTSTAMP:${toIcsInstant(new Date().toISOString())}`,
    `DTSTART:${toIcsInstant(toUtcIso(event.startDate, event.timezone))}`,
    ...(event.endDate ? [`DTEND:${toIcsInstant(toUtcIso(event.endDate, event.timezone))}`] : []),
    `SUMMARY:${escapeIcsText(event.name)}`,
    ...(event.description ? [`DESCRIPTION:${escapeIcsText(event.description)}`] : []),
    ...(location ? [`LOCATION:${escapeIcsText(location)}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    ...(event.tags?.length ? [`CATEGORIES:${event.tags.map(escapeIcsText).join(',')}`] : []),
    ...(organizer ? [`ORGANIZER;CN=${escapeIcsText(organizer.name)}:mailto:${organizer.email}`] : []),
    `STATUS:${toIcsStatus(event.status)}`,
    'TRANSP:OPAQUE',
    'SEQUENCE:0',
    'END:VEVENT',
  ]
}

/** La hora de pared de OTE vuelve a instante absoluto usando su zona */
function toUtcIso(wallClock: string, timezone: string): string {
  return new Date(Datetime.toZonedOffsetString(wallClock, timezone)).toISOString()
}

/** `2026-09-10T16:00:00.000Z` → `20260910T160000Z` */
function toIcsInstant(isoString: string): string {
  return isoString.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function toIcsStatus(status: OteEvent['status']): string {
  switch (status) {
    case 'cancelled':
      return 'CANCELLED'
    case 'tentative':
    case 'postponed':
      return 'TENTATIVE'
    default:
      return 'CONFIRMED'
  }
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/**
 * RFC 5545 limita las líneas a 75 octetos; las siguientes van sangradas con un
 * espacio. Se cuenta en octetos, no en caracteres, porque las tildes ocupan dos.
 */
function fold(line: string): string {
  const encoder = new TextEncoder()
  if (encoder.encode(line).length <= 75) return line

  const parts: string[] = []
  let current = ''
  let currentBytes = 0

  for (const char of line) {
    const charBytes = encoder.encode(char).length
    // A partir de la segunda línea se pierde un octeto por el espacio de sangrado.
    const limit = parts.length === 0 ? 75 : 74

    if (currentBytes + charBytes > limit) {
      parts.push(current)
      current = ''
      currentBytes = 0
    }

    current += char
    currentBytes += charBytes
  }

  if (current) parts.push(current)

  return parts.join('\r\n ')
}
