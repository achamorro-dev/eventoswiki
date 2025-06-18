import { EventsLocator } from '@/events/di/events.locator'
import { EventNotFound } from '@/events/domain/errors/event-not-found'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'
import { z } from 'astro/zod'
import { ActionError, defineAction } from 'astro:actions'

export const deleteEventAction = defineAction({
  input: z.object({
    eventId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { user, session } = context.locals
      const eventId = input.eventId
      if (!user || !session || !eventId) {
        throw new BadRequest('Error al eliminar el evento')
      }

      await EventsLocator.deleteEventCommand().execute({
        eventId,
        userId: user.id,
      })

      return null
    } catch (error) {
      switch (true) {
        case error instanceof EventNotFound:
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'Evento no encontrado',
          })
        case error instanceof BadRequest:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: error.message,
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al eliminar la organización',
          })
      }
    }
  },
})
