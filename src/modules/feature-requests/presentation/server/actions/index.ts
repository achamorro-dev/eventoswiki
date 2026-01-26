import { createFeatureRequestAction } from './create-feature-request.action'
import { deleteFeatureRequestAction } from './delete-feature-request.action'
import { toggleFeatureRequestVoteAction } from './toggle-feature-request-vote.action'
import { updateFeatureRequestStatusAction } from './update-feature-request-status.action'

export const featureRequestsServerActions = {
  createFeatureRequestAction,
  deleteFeatureRequestAction,
  toggleFeatureRequestVoteAction,
  updateFeatureRequestStatusAction,
}
