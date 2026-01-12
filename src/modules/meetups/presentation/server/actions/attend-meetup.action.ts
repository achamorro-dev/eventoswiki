import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { AttendMeetupCommand } from '@/meetups/application/attend-meetup.command'
import { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { MeetupNotFound } from '@/meetups/domain/errors/meetup-not-found'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'

export const attendMeetupAction = defineAction({
  accept: 'json',
  input: z.object({
    meetupId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { user } = context.locals
      const meetupId = input.meetupId
      if (!user || !meetupId) {
        throw new BadRequest('Error al solicitar asistir al meetup')
      }

      // Verificar si el meetup permite asistentes y hay cupo
      const meetup = await MeetupsContainer.get(FindMeetupQuery).execute({ id: meetupId })
      const { canAttend, reason } = meetup.canUserAttend()

      if (!canAttend) {
        throw new BadRequest(reason || 'No puedes asistir a este meetup')
      }

      await MeetupsContainer.get(AttendMeetupCommand).execute({
        meetupId,
        userId: user.id,
      })

      return null
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
            message: 'Se ha producido un error al solicitar asistir al meetup',
          })
      }
    }
  },
})
