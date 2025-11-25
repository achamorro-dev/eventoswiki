import { ActionError, defineAction } from 'astro:actions'
import type { z } from 'astro:content'
import { MeetupsLocator } from '@/meetups/di/meetups.locator'
import { MeetupAlreadyExists } from '@/meetups/domain/errors/meetup-already-exists.error'
import type { MeetupEditableData } from '@/meetups/domain/meetup'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { saveMeetupActionSchema } from './save-meetup-action.schema'

export const saveMeetupAction = defineAction({
  accept: 'json',
  input: saveMeetupActionSchema,
  handler: async (input, context) => {
    try {
      const { organizationId, meetupId } = input
      const userId = context.locals.user?.id
      const meetupData = _parseMeetupDataPayload(input)

      if (!userId) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'No estás autorizado para guardar este meetup',
        })
      }

      const isNewMeetup = !meetupId
      isNewMeetup
        ? await _createMeetup(organizationId, meetupData, userId)
        : await _saveMeetup(meetupId, meetupData, userId)

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

async function _createMeetup(organizationId: string, newMeetup: MeetupEditableData, userId: string) {
  await MeetupsLocator.createMeetupCommand().execute({
    organizationId,
    userId,
    data: {
      ...newMeetup,
      location: newMeetup.location ?? null,
      startsAt: Datetime.toDateTimeIsoString(newMeetup.startsAt),
      endsAt: Datetime.toDateTimeIsoString(newMeetup.endsAt),
    },
  })
}

async function _saveMeetup(meetupId: string, newMeetup: MeetupEditableData, userId: string) {
  await MeetupsLocator.updateMeetupCommand().execute({
    meetupId,
    userId,
    data: {
      ...newMeetup,
      location: newMeetup.location ?? null,
      startsAt: Datetime.toDateTimeIsoString(newMeetup.startsAt),
      endsAt: Datetime.toDateTimeIsoString(newMeetup.endsAt),
    },
  })
}

function _parseMeetupDataPayload(input: z.infer<typeof saveMeetupActionSchema>): MeetupEditableData {
  return {
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription,
    content: input.content,
    startsAt: Datetime.toDateIsoString(input.startsAt),
    endsAt: Datetime.toDateIsoString(input.endsAt),
    image: input.image,
    type: input.type,
    location: input.location ?? null,
    web: input.web,
    twitter: input.twitter,
    linkedin: input.linkedin,
    youtube: input.youtube,
    twitch: input.twitch,
    facebook: input.facebook,
    instagram: input.instagram,
    github: input.github,
    telegram: input.telegram,
    whatsapp: input.whatsapp,
    discord: input.discord,
    tiktok: input.tiktok,
    streamingUrl: input.streamingUrl,
    tags: input.tags,
    tagColor: input.tagColor,
    place: input.place
      ? {
          id: input.place.id,
          name: input.place.name,
          address: input.place.address,
        }
      : undefined,
  }
}
