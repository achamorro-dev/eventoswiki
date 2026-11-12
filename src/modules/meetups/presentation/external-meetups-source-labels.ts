import { type ExternalMeetupsSource, ExternalMeetupsSources } from '../domain/external-meetups-source'

interface ExternalMeetupsSourceLabels {
  name: string
  group: string
}

export const EXTERNAL_MEETUPS_SOURCE_LABELS: Record<ExternalMeetupsSource, ExternalMeetupsSourceLabels> = {
  [ExternalMeetupsSources.MeetupCom]: { name: 'Meetup.com', group: 'grupo de Meetup.com' },
  [ExternalMeetupsSources.Luma]: { name: 'Luma', group: 'calendario de Luma' },
}
