import { ActionError, defineAction } from 'astro:actions'
import { CreateFeatureRequestCommand } from '../../../application/create-feature-request.command'
import { FeatureRequestsContainer } from '../../../di/feature-requests.container'
import { createFeatureRequestActionSchema } from './create-feature-request-action.schema'

export const createFeatureRequestAction = defineAction({
  accept: 'json',
  input: createFeatureRequestActionSchema,
  handler: async (input, context) => {
    const userId = context.locals.user?.id
    if (!userId) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'Debes iniciar sesión para crear una solicitud',
      })
    }

    try {
      await FeatureRequestsContainer.get(CreateFeatureRequestCommand).execute({
        title: input.title,
        description: input.description,
        userId,
      })
      return
    } catch (_error) {
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al crear la solicitud',
      })
    }
  },
})
