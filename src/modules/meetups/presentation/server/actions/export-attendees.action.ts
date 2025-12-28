import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { ExportAttendeesCommand } from '@/meetups/application/export-attendees.command'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { MeetupNotFound } from '@/meetups/domain/errors/meetup-not-found'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'

export const exportAttendeesAction = defineAction({
  accept: 'json',
  input: z.object({
    meetupId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { user } = context.locals
      const { meetupId } = input

      if (!user) {
        throw new BadRequest('Debes iniciar sesión para realizar esta acción')
      }

      // Use the export attendees command
      const result = await MeetupsContainer.get(ExportAttendeesCommand).execute({
        meetupId,
        userId: user.id,
      })

      return result
    } catch (error) {
      switch (true) {
        case error instanceof MeetupNotFound:
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'Meetup no encontrado',
          })
        case error instanceof BadRequest:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: error.message,
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al exportar los asistentes',
          })
      }
    }
  },
})
