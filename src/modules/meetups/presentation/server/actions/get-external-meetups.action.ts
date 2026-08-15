import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { GetExternalMeetupsQuery } from '@/meetups/application/get-external-meetups.query'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { MeetupGroupNotFound } from '@/meetups/domain/errors/meetup-group-not-found.error'
import { OrganizationMeetupUrlMissing } from '@/meetups/domain/errors/organization-meetup-url-missing.error'

export const getExternalMeetupsAction = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z.string(),
  }),
  handler: async (input, context) => {
    const userId = context.locals.user?.id

    if (!userId) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'No estás autorizado a ver los meetups de Meetup.com de esta organización',
      })
    }

    try {
      return await MeetupsContainer.get(GetExternalMeetupsQuery).execute({
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
            message: 'Se ha producido un error al obtener los meetups de Meetup.com',
          })
      }
    }
  },
})
