import type { FeatureRequest } from '@/modules/feature-requests/domain/feature-request'
import type { FeatureRequestsRepository } from '@/modules/feature-requests/domain/feature-requests.repository'
import { Query } from '@/shared/application/use-case/query'

interface GetFeatureRequestRequest {
  id: string
}

export class GetFeatureRequestQuery extends Query<FeatureRequest | null, GetFeatureRequestRequest> {
  constructor(private readonly repository: FeatureRequestsRepository) {
    super()
  }

  async execute(input: GetFeatureRequestRequest): Promise<FeatureRequest | null> {
    return await this.repository.findById(input.id)
  }
}
