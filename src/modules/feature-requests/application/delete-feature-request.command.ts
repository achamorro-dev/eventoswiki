import type { FeatureRequestsRepository } from '@/modules/feature-requests/domain/feature-requests.repository'
import { Command } from '@/shared/application/use-case/command'

interface DeleteFeatureRequestRequest {
  featureRequestId: string
}

export class DeleteFeatureRequestCommand extends Command<DeleteFeatureRequestRequest> {
  constructor(private readonly repository: FeatureRequestsRepository) {
    super()
  }

  async execute(input: DeleteFeatureRequestRequest): Promise<void> {
    await this.repository.delete(input.featureRequestId)
  }
}
