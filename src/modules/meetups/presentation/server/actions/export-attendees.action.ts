import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { MeetupsLocator } from '@/meetups/di/meetups.locator'
import { MeetupNotFound } from '@/meetups/domain/errors/meetup-not-found'
import { OrganizationsLocator } from '@/organizations/di/organizations.locator'
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

      // Verify the meetup exists and user is organizer
      const meetup = await MeetupsLocator.findMeetupQuery().execute({ id: meetupId })

      if (!meetup.organizationId) {
        throw new BadRequest('Este meetup no tiene organización')
      }

      // Check if user is organizer
      const userIsOrganizer = await OrganizationsLocator.userIsOrganizerEnsurer().execute({
        userId: user.id,
        organizationId: meetup.organizationId,
      })

      if (!userIsOrganizer) {
        throw new BadRequest('No tienes permisos para exportar los asistentes de este meetup')
      }

      // Get attendees with user data
      const attendees = await MeetupsLocator.findMeetupAttendeesQuery().execute(meetupId)

      // Return the data - the client will handle Excel generation
      return {
        attendees,
        meetupTitle: meetup.title,
      }
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

