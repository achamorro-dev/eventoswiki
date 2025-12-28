import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { CreateEventCommand } from '@/events/application/create-event.command'
import { UpdateEventCommand } from '@/events/application/update-event.command'
import { EventsContainer } from '@/events/di/events.container'
import { EventAlreadyExists } from '@/events/domain/errors/event-already-exists.error'
import type { EventEditableData } from '@/events/domain/event'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { saveEventActionSchema } from './save-event.schema'

export const saveEventAction = defineAction({
  accept: 'json',
  input: saveEventActionSchema,
  handler: async (input, context) => {
    try {
      const { organizationId, eventId } = input
      const userId = context.locals.user?.id
      const eventData = _parseEventDataPayload(input)

      if (!userId) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'No estás autorizado para guardar este evento',
        })
      }

      const isNewEvent = !eventId
      isNewEvent ? await _createEvent(organizationId, eventData, userId) : await _saveEvent(eventId, eventData, userId)

      return
    } catch (error) {
      switch (true) {
        case error instanceof EventAlreadyExists:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'Este evento ya se encuentra dado de alta',
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al guardar el evento',
          })
      }
    }
  },
})

async function _createEvent(organizationId: string, newEvent: EventEditableData, userId: string) {
  await EventsContainer.get(CreateEventCommand).execute({
    organizationId,
    userId,
    data: {
      ...newEvent,
      location: newEvent.location ?? null,
      startsAt: Datetime.toDateTimeIsoString(newEvent.startsAt),
      endsAt: Datetime.toDateTimeIsoString(newEvent.endsAt),
    },
  })
}

async function _saveEvent(eventId: string, newEvent: EventEditableData, userId: string) {
  await EventsContainer.get(UpdateEventCommand).execute({
    eventId,
    userId,
    data: {
      ...newEvent,
      location: newEvent.location ?? null,
      startsAt: Datetime.toDateTimeIsoString(newEvent.startsAt),
      endsAt: Datetime.toDateTimeIsoString(newEvent.endsAt),
    },
  })
}

function _parseEventDataPayload(input: z.infer<typeof saveEventActionSchema>): EventEditableData {
  return {
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription,
    content: input.content,
    startsAt: Datetime.toDateTimeIsoString(input.startsAt),
    endsAt: Datetime.toDateTimeIsoString(input.endsAt),
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
    place: input.place
      ? {
          id: input.place.id,
          name: input.place.name,
          address: input.place.address,
        }
      : undefined,
    tags: input.tags,
    tagColor: input.tagColor,
  }
}
