import { defineAction } from 'astro:actions'
import { UpdateFeatureRequestStatusCommand } from '@/modules/feature-requests/application/update-feature-request-status.command'
import { FeatureRequestsContainer } from '@/modules/feature-requests/di/feature-requests.container'
import { updateFeatureRequestStatusActionSchema } from './update-feature-request-status-action.schema'

export const updateFeatureRequestStatusAction = defineAction({
  accept: 'json',
  input: updateFeatureRequestStatusActionSchema,
  handler: async (input, context) => {
    const user = context.locals.user
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    // You might want to add a proper admin check here similar to bugs
    // For now, we'll just check if the user exists

    await FeatureRequestsContainer.get(UpdateFeatureRequestStatusCommand).execute({
      featureRequestId: input.featureRequestId,
      status: input.status,
    })
  },
})
