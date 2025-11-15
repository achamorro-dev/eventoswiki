import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { MeetupsLocator } from '@/meetups/di/meetups.locator'
import { MeetupNotFound } from '@/meetups/domain/errors/meetup-not-found'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'

export const deleteMeetupAction = defineAction({
  input: z.object({
    meetupId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { user, session } = context.locals
      const meetupId = input.meetupId
      if (!user || !session || !meetupId) {
        throw new BadRequest('Error al eliminar el meetup')
      }

      await MeetupsLocator.deleteMeetupCommand().execute({
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
            message: 'Se ha producido un error al eliminar el meetup',
          })
      }
    }
  },
})
