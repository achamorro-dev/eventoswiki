import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import { UnattendMeetupCommand } from '@/meetups/application/unattend-meetup.command'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { MeetupAttendeeDoesNotExist } from '@/meetups/domain/errors/meetup-attendee-does-not-exist.error'
import { MeetupNotFound } from '@/meetups/domain/errors/meetup-not-found'
import { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'

export const removeAttendeeAction = defineAction({
  accept: 'json',
  input: z.object({
    meetupId: z.string(),
    userId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { user } = context.locals
      const { meetupId, userId } = input

      if (!user) {
        throw new BadRequest('Debes iniciar sesión para realizar esta acción')
      }

      // Verify the meetup exists and user is organizer
      const meetup = await MeetupsContainer.get(FindMeetupQuery).execute({ id: meetupId })

      if (!meetup.organizationId) {
        throw new BadRequest('Este meetup no tiene organización')
      }

      // Check if user is organizer
      try {
        await OrganizationsContainer.get(UserIsOrganizerEnsurer).ensure({
          userId: user.id,
          organizationId: meetup.organizationId,
        })
      } catch {
        throw new BadRequest('No tienes permisos para eliminar asistentes de este meetup')
      }

      // Remove the attendee
      await MeetupsContainer.get(UnattendMeetupCommand).execute({
        meetupId,
        userId,
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
            message: 'El usuario no es asistente de este meetup',
          })
        case error instanceof BadRequest:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: error.message,
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al eliminar el asistente',
          })
      }
    }
  },
})
