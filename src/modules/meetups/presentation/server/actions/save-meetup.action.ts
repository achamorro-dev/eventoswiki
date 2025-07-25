import { MeetupsLocator } from '@/meetups/di/meetups.locator'
import { MeetupAlreadyExists } from '@/meetups/domain/errors/meetup-already-exists.error'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { z } from 'astro/zod'
import { ActionError, defineAction } from 'astro:actions'

interface MeetupDataPayload {
  title: string
  slug: string
  shortDescription: string
  content: string
  startsAt: Date
  endsAt: Date
  image: string
  location?: string | undefined
  web?: string | undefined
  twitter?: string | undefined
  linkedin?: string | undefined
  youtube?: string | undefined
  twitch?: string | undefined
  facebook?: string | undefined
  instagram?: string | undefined
  github?: string | undefined
  telegram?: string | undefined
  whatsapp?: string | undefined
  discord?: string | undefined
  tiktok?: string | undefined
  tags: string[]
  tagColor: string
}

export const saveMeetupAction = defineAction({
  input: z.object({
    title: z.string(),
    slug: z.string(),
    shortDescription: z.string(),
    content: z.string(),
    startsAt: z.string().transform(date => Datetime.toDate(date)),
    endsAt: z.string().transform(date => Datetime.toDate(date)),
    image: z.string(),
    location: z.string().optional(),
    web: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    twitch: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    github: z.string().optional(),
    telegram: z.string().optional(),
    whatsapp: z.string().optional(),
    discord: z.string().optional(),
    tiktok: z.string().optional(),
    organizationId: z.string(),
    meetupId: z.string().optional(),
    tags: z.array(z.string()).default([]),
    tagColor: z.string().default(''),
  }),
  handler: async input => {
    try {
      const { organizationId, meetupId, ...newMeetup } = input

      const isNewMeetup = !meetupId
      isNewMeetup ? await _createMeetup(organizationId, newMeetup) : await _saveMeetup(meetupId, newMeetup)

      return
    } catch (error) {
      switch (true) {
        case error instanceof MeetupAlreadyExists:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'Este meetup ya se encuentra dado de alta',
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al guardar el meetup',
          })
      }
    }
  },
})

async function _createMeetup(organizationId: string, newMeetup: MeetupDataPayload) {
  await MeetupsLocator.createMeetupCommand().execute({
    organizationId,
    data: {
      ...newMeetup,
      location: newMeetup.location ?? null,
      startsAt: Datetime.toDateTimeIsoString(newMeetup.startsAt),
      endsAt: Datetime.toDateTimeIsoString(newMeetup.endsAt),
    },
  })
}

async function _saveMeetup(meetupId: string, newMeetup: MeetupDataPayload) {
  await MeetupsLocator.updateMeetupCommand().execute({
    meetupId,
    data: {
      ...newMeetup,
      location: newMeetup.location ?? null,
      startsAt: Datetime.toDateTimeIsoString(newMeetup.startsAt),
      endsAt: Datetime.toDateTimeIsoString(newMeetup.endsAt),
    },
  })
}
