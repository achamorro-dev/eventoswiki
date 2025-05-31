import { EventsLocator } from '@/events/di/events.locator'
import { EventAlreadyExists } from '@/events/domain/errors/event-already-exists.error'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { z } from 'astro/zod'
import { ActionError, defineAction } from 'astro:actions'

interface EventDataPayload {
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

export const saveEventAction = defineAction({
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
    eventId: z.string().optional(),
    tags: z.array(z.string()).default([]),
    tagColor: z.string().default(''),
  }),
  handler: async input => {
    try {
      const { organizationId, eventId, ...newEvent } = input

      const isNewEvent = !eventId
      isNewEvent ? await _createEvent(organizationId, newEvent) : await _saveEvent(eventId, newEvent)

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

async function _createEvent(organizationId: string, newEvent: EventDataPayload) {
  await EventsLocator.createEventCommand().execute({
    organizationId,
    data: {
      ...newEvent,
      location: newEvent.location ?? null,
      startsAt: Datetime.toDateIsoString(newEvent.startsAt),
      endsAt: Datetime.toDateIsoString(newEvent.endsAt),
    },
  })
}

async function _saveEvent(eventId: string, newEvent: EventDataPayload) {
  await EventsLocator.updateEventCommand().execute({
    eventId,
    data: {
      ...newEvent,
      location: newEvent.location ?? null,
      startsAt: Datetime.toDateIsoString(newEvent.startsAt),
      endsAt: Datetime.toDateIsoString(newEvent.endsAt),
    },
  })
}
