import { FeatureRequest } from './feature-request'
import { FeatureRequestId } from './feature-request-id'

export interface FeatureRequestsRepository {
  save(featureRequest: FeatureRequest): Promise<void>
  findAll(currentUserId?: string): Promise<FeatureRequest[]>
  toggleVote(featureRequestId: FeatureRequestId, userId: string): Promise<void>
}
