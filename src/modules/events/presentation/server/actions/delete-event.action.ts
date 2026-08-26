import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { DeleteEventCommand } from '@/events/application/delete-event.command'
import { EventsContainer } from '@/events/di/events.container'
import { EventNotFound } from '@/events/domain/errors/event-not-found'
import { OrganizerNotFound } from '@/organizations/domain/errors/organizer-not-found.error'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'
import { UserIsNotAdminError } from '@/users/domain/errors/user-is-not-admin.error'

export const deleteEventAction = defineAction({
  accept: 'json',
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

      await EventsContainer.get(DeleteEventCommand).execute({
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
        case error instanceof OrganizerNotFound:
          throw new ActionError({
            code: 'FORBIDDEN',
            message: 'No estás autorizado para eliminar este evento',
          })
        case error instanceof UserIsNotAdminError:
          throw new ActionError({
            code: 'FORBIDDEN',
            message: 'Solo los administradores pueden eliminar eventos sin organización',
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
