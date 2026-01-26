import { FeatureRequest } from './feature-request'
import { FeatureRequestId } from './feature-request-id'

export interface FeatureRequestsRepository {
  save(featureRequest: FeatureRequest): Promise<void>
  findAll(currentUserId?: string): Promise<FeatureRequest[]>
  findById(id: string): Promise<FeatureRequest | null>
  update(featureRequest: FeatureRequest): Promise<void>
  delete(id: string): Promise<void>
  toggleVote(featureRequestId: FeatureRequestId, userId: string): Promise<void>
}
