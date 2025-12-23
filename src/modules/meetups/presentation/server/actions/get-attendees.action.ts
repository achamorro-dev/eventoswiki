import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { MeetupsLocator } from '@/meetups/di/meetups.locator'
import { MeetupNotFound } from '@/meetups/domain/errors/meetup-not-found'

export const getAttendeesAction = defineAction({
  accept: 'json',
  input: z.object({
    meetupId: z.string(),
  }),
  handler: async (input) => {
    try {
      const { meetupId } = input

      // Get attendees with user data
      const attendees = await MeetupsLocator.findMeetupAttendeesQuery().execute(meetupId)

      return { attendees: attendees.map(attendee => attendee.toPrimitives()) }
    } catch (error) {
      switch (true) {
        case error instanceof MeetupNotFound:
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'Meetup no encontrado',
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al obtener los asistentes',
          })
      }
    }
  },
})
