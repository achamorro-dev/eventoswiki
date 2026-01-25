import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { ToggleFeatureRequestVoteCommand } from '../../../application/toggle-feature-request-vote.command'
import { FeatureRequestsContainer } from '../../../di/feature-requests.container'

export const toggleFeatureRequestVoteAction = defineAction({
  accept: 'json',
  input: z.object({
    featureRequestId: z.string(),
  }),
  handler: async (input, context) => {
    const userId = context.locals.user?.id
    if (!userId) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'Debes iniciar sesión para votar',
      })
    }

    try {
      await FeatureRequestsContainer.get(ToggleFeatureRequestVoteCommand).execute({
        featureRequestId: input.featureRequestId,
        userId,
      })
      return
    } catch (_error) {
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al votar la solicitud',
      })
    }
  },
})
