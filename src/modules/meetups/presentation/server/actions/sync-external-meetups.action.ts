import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { SyncExternalMeetupsCommand } from '@/meetups/application/sync-external-meetups.command'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { ExternalMeetupsSources } from '@/meetups/domain/external-meetups-source'
import { EXTERNAL_MEETUPS_SOURCE_LABELS } from '../../external-meetups-source-labels'
import { toExternalMeetupsActionError } from './external-meetups-action-error'

export const syncExternalMeetupsAction = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z.string(),
    source: z.nativeEnum(ExternalMeetupsSources),
    externalIds: z.array(z.string()).optional(),
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
      return await MeetupsContainer.get(SyncExternalMeetupsCommand).execute({
        organizationId: input.organizationId,
        userId,
        source: input.source,
        externalIds: input.externalIds,
      })
    } catch (error) {
      throw toExternalMeetupsActionError(
        error,
        input.source,
        `Se ha producido un error al sincronizar los meetups de ${EXTERNAL_MEETUPS_SOURCE_LABELS[input.source].name}`,
      )
    }
  },
})
