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
}

export interface ExternalMeetupsProvider {
  getEvents(groupUrl: string): Promise<ExternalMeetupEvent[]>
}
