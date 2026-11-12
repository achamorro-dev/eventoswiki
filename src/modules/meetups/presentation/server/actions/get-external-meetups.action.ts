import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { GetExternalMeetupsQuery } from '@/meetups/application/get-external-meetups.query'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { ExternalMeetupsSources } from '@/meetups/domain/external-meetups-source'
import { EXTERNAL_MEETUPS_SOURCE_LABELS } from '../../external-meetups-source-labels'
import { toExternalMeetupsActionError } from './external-meetups-action-error'

export const getExternalMeetupsAction = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z.string(),
    source: z.nativeEnum(ExternalMeetupsSources),
  }),
  handler: async (input, context) => {
    const userId = context.locals.user?.id
    const sourceName = EXTERNAL_MEETUPS_SOURCE_LABELS[input.source].name

    if (!userId) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: `No estás autorizado a ver los meetups de ${sourceName} de esta organización`,
      })
    }

    try {
      return await MeetupsContainer.get(GetExternalMeetupsQuery).execute({
        organizationId: input.organizationId,
        userId,
        source: input.source,
      })
    } catch (error) {
      throw toExternalMeetupsActionError(
        error,
        input.source,
        `Se ha producido un error al obtener los meetups de ${sourceName}`,
      )
    }
  },
})
