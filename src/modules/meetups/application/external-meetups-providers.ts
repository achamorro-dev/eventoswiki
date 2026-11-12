import type { ExternalMeetupsProvider } from '../domain/external-meetups-provider'
import { type ExternalMeetupsSource, ExternalMeetupsSources } from '../domain/external-meetups-source'

export class ExternalMeetupsProviders {
  private readonly providersBySource: Record<ExternalMeetupsSource, ExternalMeetupsProvider>

  constructor(meetupComEventsProvider: ExternalMeetupsProvider, lumaEventsProvider: ExternalMeetupsProvider) {
    this.providersBySource = {
      [ExternalMeetupsSources.MeetupCom]: meetupComEventsProvider,
      [ExternalMeetupsSources.Luma]: lumaEventsProvider,
    }
  }

  get(source: ExternalMeetupsSource): ExternalMeetupsProvider {
    return this.providersBySource[source]
  }
}
