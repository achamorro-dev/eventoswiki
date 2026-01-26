import type { FeatureRequestStatus } from '@/modules/feature-requests/domain/feature-request'
import type { FeatureRequestsRepository } from '@/modules/feature-requests/domain/feature-requests.repository'
import { Command } from '@/shared/application/use-case/command'

interface UpdateFeatureRequestStatusRequest {
  featureRequestId: string
  status: FeatureRequestStatus
}

export class UpdateFeatureRequestStatusCommand extends Command<UpdateFeatureRequestStatusRequest> {
  constructor(private readonly repository: FeatureRequestsRepository) {
    super()
  }

  async execute(input: UpdateFeatureRequestStatusRequest): Promise<void> {
    const featureRequest = await this.repository.findById(input.featureRequestId)
    if (!featureRequest) {
      throw new Error(`Feature request with id ${input.featureRequestId} not found`)
    }

    featureRequest.status = input.status
    featureRequest.updatedAt = new Date()

    await this.repository.update(featureRequest)
  }
}
