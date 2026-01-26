import { defineAction } from 'astro:actions'
import { DeleteFeatureRequestCommand } from '@/modules/feature-requests/application/delete-feature-request.command'
import { GetFeatureRequestQuery } from '@/modules/feature-requests/application/get-feature-request.query'
import { FeatureRequestsContainer } from '@/modules/feature-requests/di/feature-requests.container'
import { deleteFeatureRequestActionSchema } from './delete-feature-request-action.schema'

export const deleteFeatureRequestAction = defineAction({
  accept: 'json',
  input: deleteFeatureRequestActionSchema,
  handler: async (input, context) => {
    const user = context.locals.user
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Get the feature request to check ownership
    const featureRequest = await FeatureRequestsContainer.get(GetFeatureRequestQuery).execute({
      id: input.featureRequestId,
    })

    if (!featureRequest) {
      throw new Error('Feature request not found')
    }

    // Only the creator can delete their feature request
    if (featureRequest.userId !== user.id) {
      throw new Error('Forbidden: You can only delete your own feature requests')
    }

    await FeatureRequestsContainer.get(DeleteFeatureRequestCommand).execute({
      featureRequestId: input.featureRequestId,
    })
  },
})
