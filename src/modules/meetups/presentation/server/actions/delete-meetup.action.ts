import { EventsLocator } from '@/events/di/events.locator'
import { MeetupsLocator } from '@/meetups/di/meetups.locator'
import { OrganizationsLocator } from '@/organizations/di/organizations.locator'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'
import { z } from 'astro/zod'
import { ActionError, defineAction } from 'astro:actions'

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
        case error instanceof OrganizationNotFound:
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'Organización no encontrada',
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
