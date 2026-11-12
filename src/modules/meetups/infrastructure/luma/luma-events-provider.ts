import { ExternalMeetupsGroupNotFound } from '../../domain/errors/external-meetups-group-not-found.error'
import { ExternalMeetupsRateLimited } from '../../domain/errors/external-meetups-rate-limited.error'
import type {
  ExternalMeetupEvent,
  ExternalMeetupEventSummary,
  ExternalMeetupsProvider,
} from '../../domain/external-meetups-provider'
import { MeetupTypes } from '../../domain/meetup-type'
import type {
  LumaCalendarFeedEventDto,
  LumaEventPageDto,
  LumaJsonLdEventDto,
  LumaJsonLdLocationDto,
  LumaJsonLdPostalAddressDto,
} from './luma.dto'
import { LumaCalendarFeedParser } from './luma-calendar-feed-parser'
import { LumaDescriptionHtmlRenderer } from './luma-description-html-renderer'
import { LumaEventPageParser } from './luma-event-page-parser'

const LUMA_WEB_URL = 'https://luma.com'
const LUMA_CALENDAR_FEED_URL = 'https://api.luma.com/ics/get'
const CALENDAR_ID_PATTERN = /\bcal-[A-Za-z0-9]+\b/
const CALENDAR_DEEP_LINK_PATTERN = /luma:\/\/calendar\/(cal-[A-Za-z0-9]+)/
const EVENT_PAGE_URL_PATTERN = /https:\/\/(?:luma\.com|lu\.ma)\/([A-Za-z0-9-]+)(?![\w/-])/
const HTTP_URL_PATTERN = /^https?:\/\//i
const LUMA_EVENT_UID_PREFIX = 'evt-'
const UID_DOMAIN_SEPARATOR = '@'
const CANCELLED_STATUS = 'CANCELLED'
const JSON_LD_PLACE_TYPE = 'Place'
const EVENT_PAGES_BATCH_SIZE = 3
const NOT_FOUND_STATUSES = new Set([400, 404])
const RATE_LIMITED_STATUS = 429

const MEETUP_TYPES_BY_ATTENDANCE_MODE: Record<string, string> = {
  OfflineEventAttendanceMode: MeetupTypes.InPerson,
  OnlineEventAttendanceMode: MeetupTypes.Online,
  MixedEventAttendanceMode: MeetupTypes.Hybrid,
}

interface LumaCalendarFeed {
  calendarId: string
  events: LumaCalendarFeedEventDto[]
}

export class LumaEventsProvider implements ExternalMeetupsProvider {
  async getEventSummaries(calendarUrl: string): Promise<ExternalMeetupEventSummary[]> {
    const { events } = await this._getCalendarFeed(calendarUrl)

    return events.map(event => this._toEventSummary(event))
  }

  async getEvents(calendarUrl: string, externalIds?: string[]): Promise<ExternalMeetupEvent[]> {
    const { calendarId, events } = await this._getCalendarFeed(calendarUrl)
    const eventsToSync = this._filterByExternalIds(events, externalIds)
    const eventPages = await this._getEventPages(calendarUrl, eventsToSync)

    return eventsToSync
      .map((event, index) => ({ event, page: eventPages[index] }))
      .filter(({ page }) => this._isHostedByCalendar(page, calendarId))
      .map(({ event, page }) => this._toExternalMeetupEvent(event, page))
  }

  private async _getCalendarFeed(calendarUrl: string): Promise<LumaCalendarFeed> {
    const calendarId = await this._resolveCalendarId(calendarUrl)
    const feedUrl = new URL(LUMA_CALENDAR_FEED_URL)
    feedUrl.search = new URLSearchParams({ entity: 'calendar', id: calendarId }).toString()

    const calendarFeed = await this._fetchText(calendarUrl, feedUrl)
    if (!calendarFeed) {
      throw new ExternalMeetupsGroupNotFound(calendarUrl)
    }

    const events = LumaCalendarFeedParser.parse(calendarFeed).filter(event => this._isActiveLumaEvent(event))
    return { calendarId, events }
  }

  private _isActiveLumaEvent(event: LumaCalendarFeedEventDto): boolean {
    return event.uid.startsWith(LUMA_EVENT_UID_PREFIX) && event.status !== CANCELLED_STATUS
  }

  private _isHostedByCalendar(page: LumaEventPageDto | null, calendarId: string): boolean {
    return !page?.calendarId || page.calendarId === calendarId
  }

  private async _resolveCalendarId(calendarUrl: string): Promise<string> {
    const calendarIdInUrl = CALENDAR_ID_PATTERN.exec(calendarUrl)?.[0]
    if (calendarIdInUrl) {
      return calendarIdInUrl
    }

    const calendarPage = await this._fetchText(
      calendarUrl,
      new URL(this._extractCalendarSlug(calendarUrl), LUMA_WEB_URL),
    )
    const calendarId = calendarPage ? CALENDAR_DEEP_LINK_PATTERN.exec(calendarPage)?.[1] : undefined

    if (!calendarId) {
      throw new ExternalMeetupsGroupNotFound(calendarUrl)
    }

    return calendarId
  }

  private _extractCalendarSlug(calendarUrl: string): string {
    let pathname: string

    try {
      pathname = new URL(calendarUrl).pathname
    } catch (_error) {
      throw new ExternalMeetupsGroupNotFound(calendarUrl)
    }

    const slug = pathname.split('/').find(Boolean)
    if (!slug) {
      throw new ExternalMeetupsGroupNotFound(calendarUrl)
    }

    return encodeURIComponent(slug)
  }

  private _filterByExternalIds(events: LumaCalendarFeedEventDto[], externalIds?: string[]) {
    if (!externalIds) {
      return events
    }

    const externalIdsToSync = new Set(externalIds)

    return events.filter(event => externalIdsToSync.has(this._toExternalId(event)))
  }

  private async _getEventPages(calendarUrl: string, events: LumaCalendarFeedEventDto[]) {
    const eventPages: (LumaEventPageDto | null)[] = []

    for (let start = 0; start < events.length; start += EVENT_PAGES_BATCH_SIZE) {
      const batch = events.slice(start, start + EVENT_PAGES_BATCH_SIZE)
      eventPages.push(...(await Promise.all(batch.map(event => this._getEventPage(calendarUrl, event)))))
    }

    return eventPages
  }

  private async _getEventPage(calendarUrl: string, event: LumaCalendarFeedEventDto): Promise<LumaEventPageDto | null> {
    const html = await this._fetchText(calendarUrl, new URL(this._toEventUrl(event)))

    return html ? LumaEventPageParser.parse(html) : null
  }

  private async _fetchText(calendarUrl: string, url: URL): Promise<string | null> {
    const response = await fetch(url)

    if (NOT_FOUND_STATUSES.has(response.status)) {
      return null
    }

    if (response.status === RATE_LIMITED_STATUS) {
      throw new ExternalMeetupsRateLimited(calendarUrl)
    }

    if (!response.ok) {
      throw new Error(`Luma request to ${url.origin}${url.pathname} failed with status ${response.status}`)
    }

    return response.text()
  }

  private _toExternalId(event: LumaCalendarFeedEventDto): string {
    return event.uid.split(UID_DOMAIN_SEPARATOR)[0]
  }

  private _toEventUrl(event: LumaCalendarFeedEventDto): string {
    const eventSlug = event.description ? EVENT_PAGE_URL_PATTERN.exec(event.description)?.[1] : undefined

    return eventSlug ? `${LUMA_WEB_URL}/${eventSlug}` : `${LUMA_WEB_URL}/event/${this._toExternalId(event)}`
  }

  private _toEventSummary(event: LumaCalendarFeedEventDto): ExternalMeetupEventSummary {
    return {
      externalId: this._toExternalId(event),
      title: event.summary,
      startsAt: event.startsAt,
      imageUrl: null,
      eventUrl: this._toEventUrl(event),
    }
  }

  private _toExternalMeetupEvent(event: LumaCalendarFeedEventDto, page: LumaEventPageDto | null): ExternalMeetupEvent {
    const jsonLdEvent = page?.event ?? null
    const placeAddress = this._findPlaceAddress(jsonLdEvent)

    return {
      ...this._toEventSummary(event),
      imageUrl: this._toImageUrl(jsonLdEvent),
      description: this._toDescription(page),
      endsAt: event.endsAt,
      type: this._toMeetupType(event, jsonLdEvent),
      venueName: null,
      venueAddress: this._toPhysicalAddress(event) ?? placeAddress?.streetAddress ?? null,
      venueCity: placeAddress?.addressLocality ?? null,
      tags: [],
    }
  }

  private _toDescription(page: LumaEventPageDto | null): string | null {
    if (page?.descriptionMirror) {
      return LumaDescriptionHtmlRenderer.renderRichText(page.descriptionMirror) || null
    }

    return LumaDescriptionHtmlRenderer.renderPlainText(page?.event?.description ?? '') || null
  }

  private _toImageUrl(jsonLdEvent: LumaJsonLdEventDto | null): string | null {
    const images = [jsonLdEvent?.image ?? []].flat()

    return images.find(image => HTTP_URL_PATTERN.test(image)) ?? null
  }

  private _toMeetupType(event: LumaCalendarFeedEventDto, jsonLdEvent: LumaJsonLdEventDto | null): string {
    const attendanceMode = jsonLdEvent?.eventAttendanceMode?.split('/').pop()
    const meetupType = attendanceMode ? MEETUP_TYPES_BY_ATTENDANCE_MODE[attendanceMode] : undefined

    if (meetupType) {
      return meetupType
    }

    return this._toPhysicalAddress(event) ? MeetupTypes.InPerson : MeetupTypes.Online
  }

  private _toPhysicalAddress(event: LumaCalendarFeedEventDto): string | null {
    return event.location && !HTTP_URL_PATTERN.test(event.location) ? event.location : null
  }

  private _findPlaceAddress(jsonLdEvent: LumaJsonLdEventDto | null): LumaJsonLdPostalAddressDto | null {
    const locations: LumaJsonLdLocationDto[] = [jsonLdEvent?.location ?? []].flat()
    const address = locations.find(location => location['@type'] === JSON_LD_PLACE_TYPE)?.address

    if (typeof address === 'string') {
      return { streetAddress: address }
    }

    return address ?? null
  }
}
