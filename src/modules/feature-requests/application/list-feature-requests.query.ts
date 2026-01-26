import { Query } from '@/shared/application/use-case/query'
import { FeatureRequest } from '../domain/feature-request'
import type { FeatureRequestsRepository } from '../domain/feature-requests.repository'

interface Param {
  currentUserId?: string
}

export class ListFeatureRequestsQuery extends Query<FeatureRequest[], Param> {
  constructor(private readonly repository: FeatureRequestsRepository) {
    super()
  }

  async execute(param: Param): Promise<FeatureRequest[]> {
    return this.repository.findAll(param.currentUserId)
  }
}
