import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { SyncMeetupsFromMeetupCommand } from '@/meetups/application/sync-meetups-from-meetup.command'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { MeetupGroupNotFound } from '@/meetups/domain/errors/meetup-group-not-found.error'
import { OrganizationMeetupUrlMissing } from '@/meetups/domain/errors/organization-meetup-url-missing.error'

export const syncMeetupsFromMeetupAction = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z.string(),
  }),
  handler: async (input, context) => {
    const userId = context.locals.user?.id

    if (!userId) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'No estás autorizado para sincronizar los meetups de esta organización',
      })
    }

    try {
      return await MeetupsContainer.get(SyncMeetupsFromMeetupCommand).execute({
        organizationId: input.organizationId,
        userId,
      })
    } catch (error) {
      switch (true) {
        case error instanceof OrganizationMeetupUrlMissing:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'La organización no tiene configurada la URL de su grupo de Meetup.com',
          })
        case error instanceof MeetupGroupNotFound:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'No se ha encontrado el grupo en Meetup.com, revisa la URL configurada en la organización',
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al sincronizar los meetups',
          })
      }
    }
  },
})
