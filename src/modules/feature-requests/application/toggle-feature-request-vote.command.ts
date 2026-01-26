import { Command } from '@/shared/application/use-case/command'
import { FeatureRequestId } from '../domain/feature-request-id'
import type { FeatureRequestsRepository } from '../domain/feature-requests.repository'

interface Param {
  featureRequestId: string
  userId: string
}

export class ToggleFeatureRequestVoteCommand extends Command<Param, void> {
  constructor(private readonly repository: FeatureRequestsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { featureRequestId, userId } = param
    await this.repository.toggleVote(new FeatureRequestId(featureRequestId), userId)
  }
}
