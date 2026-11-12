export interface ExternalMeetupEvent {
  externalId: string
  title: string
  description: string | null
  eventUrl: string
  startsAt: string
  endsAt: string | null
  type: string
  venueName: string | null
  venueAddress: string | null
  venueCity: string | null
  imageUrl: string | null
  tags: string[]
}

export type ExternalMeetupEventSummary = Pick<
  ExternalMeetupEvent,
  'externalId' | 'title' | 'startsAt' | 'imageUrl' | 'eventUrl'
>

export interface ExternalMeetupsProvider {
  getEventSummaries(groupUrl: string): Promise<ExternalMeetupEventSummary[]>
  getEvents(groupUrl: string, externalIds?: string[]): Promise<ExternalMeetupEvent[]>
}
