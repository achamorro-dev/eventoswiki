export const ExternalMeetupsSources = {
  MeetupCom: 'meetup',
  Luma: 'luma',
} as const

export type ExternalMeetupsSource = (typeof ExternalMeetupsSources)[keyof typeof ExternalMeetupsSources]
