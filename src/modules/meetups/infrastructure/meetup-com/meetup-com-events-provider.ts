import { MeetupGroupNotFound } from '../../domain/errors/meetup-group-not-found.error'
import type { ExternalMeetupEvent, ExternalMeetupsProvider } from '../../domain/external-meetups-provider'
import { MeetupTypes } from '../../domain/meetup-type'

const MEETUP_API_URL = 'https://api.meetup.com/gql-ext'
const EVENTS_PAGE_SIZE = 50
const EVENT_STATUSES_TO_SYNC = ['ACTIVE', 'PAST'] as const

const EVENTS_QUERY = `
  query GroupEvents($urlname: String!, $status: EventStatus!, $first: Int!, $after: String) {
    groupByUrlname(urlname: $urlname) {
      events(status: $status, first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            title
            description
            eventUrl
            dateTime
            endTime
            eventType
            venues { name address city }
            featuredEventPhoto { baseUrl highResUrl }
          }
        }
      }
    }
  }
`

interface MeetupApiEventNode {
  id: string
  title: string
  description: string | null
  eventUrl: string
  dateTime: string
  endTime: string | null
  eventType: 'PHYSICAL' | 'ONLINE' | 'HYBRID' | null
  venues: { name: string | null; address: string | null; city: string | null }[] | null
  featuredEventPhoto: { baseUrl: string | null; highResUrl: string | null } | null
}

interface MeetupApiResponse {
  data?: {
    groupByUrlname: {
      events: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null }
        edges: { node: MeetupApiEventNode }[]
      }
    } | null
  }
  errors?: { message: string }[]
}

type EventStatusToSync = (typeof EVENT_STATUSES_TO_SYNC)[number]

export class MeetupComEventsProvider implements ExternalMeetupsProvider {
  async getEvents(groupUrl: string): Promise<ExternalMeetupEvent[]> {
    const urlname = this._extractUrlname(groupUrl)

    const eventsByStatus = await Promise.all(
      EVENT_STATUSES_TO_SYNC.map(status => this._getEventsByStatus(groupUrl, urlname, status)),
    )

    return eventsByStatus.flat()
  }

  private async _getEventsByStatus(
    groupUrl: string,
    urlname: string,
    status: EventStatusToSync,
  ): Promise<ExternalMeetupEvent[]> {
    const events: ExternalMeetupEvent[] = []
    let after: string | null = null

    do {
      const page = await this._fetchEventsPage(groupUrl, urlname, status, after)
      events.push(...page.edges.map(({ node }) => this._toExternalMeetupEvent(node)))
      after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null
    } while (after)

    return events
  }

  private async _fetchEventsPage(groupUrl: string, urlname: string, status: EventStatusToSync, after: string | null) {
    const response = await fetch(MEETUP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: EVENTS_QUERY,
        variables: { urlname, status, first: EVENTS_PAGE_SIZE, after },
      }),
    })

    if (!response.ok) {
      throw new Error(`Meetup API request failed with status ${response.status}`)
    }

    const result = (await response.json()) as MeetupApiResponse

    if (result.errors?.length) {
      throw new Error(result.errors.map(error => error.message).join(', '))
    }

    const group = result.data?.groupByUrlname
    if (!group) {
      throw new MeetupGroupNotFound(groupUrl)
    }

    return group.events
  }

  private _toExternalMeetupEvent(node: MeetupApiEventNode): ExternalMeetupEvent {
    const venue = node.venues?.at(0)

    return {
      externalId: node.id,
      title: node.title,
      description: node.description,
      eventUrl: node.eventUrl,
      startsAt: node.dateTime,
      endsAt: node.endTime,
      type: this._toMeetupType(node.eventType),
      venueName: venue?.name ?? null,
      venueAddress: venue?.address ?? null,
      venueCity: venue?.city ?? null,
      imageUrl: node.featuredEventPhoto?.highResUrl ?? node.featuredEventPhoto?.baseUrl ?? null,
    }
  }

  private _toMeetupType(eventType: MeetupApiEventNode['eventType']): string {
    switch (eventType) {
      case 'ONLINE':
        return MeetupTypes.Online
      case 'HYBRID':
        return MeetupTypes.Hybrid
      default:
        return MeetupTypes.InPerson
    }
  }

  private _extractUrlname(groupUrl: string): string {
    const localePattern = /^[a-z]{2}(-[a-z]{2})?$/i
    let pathname: string

    try {
      pathname = new URL(groupUrl).pathname
    } catch (_error) {
      throw new MeetupGroupNotFound(groupUrl)
    }

    const urlname = pathname
      .split('/')
      .filter(Boolean)
      .find(segment => !localePattern.test(segment))

    if (!urlname) {
      throw new MeetupGroupNotFound(groupUrl)
    }

    return urlname
  }
}
