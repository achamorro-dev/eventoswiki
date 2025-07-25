import { MeetupsLocator } from '@/meetups/di/meetups.locator'
import { MeetupAttendeeDoesNotExist } from '@/meetups/domain/errors/meetup-attendee-does-not-exist.error'
import { MeetupNotFound } from '@/meetups/domain/errors/meetup-not-found'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'
import { z } from 'astro/zod'
import { ActionError, defineAction } from 'astro:actions'

export const unattendMeetupAction = defineAction({
  input: z.object({
    meetupId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { user } = context.locals
      const meetupId = input.meetupId
      if (!user || !meetupId) {
        throw new BadRequest('Error al cancelar la asistencia al meetup')
      }

      await MeetupsLocator.unattendMeetupCommand().execute({
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
        case error instanceof MeetupAttendeeDoesNotExist:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'No eres asistente de este meetup',
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
