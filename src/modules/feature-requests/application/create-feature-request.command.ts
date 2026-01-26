import { Command } from '@/shared/application/use-case/command'
import { FeatureRequest } from '../domain/feature-request'
import type { FeatureRequestsRepository } from '../domain/feature-requests.repository'

interface Param {
  title: string
  description: string
  userId: string
}

export class CreateFeatureRequestCommand extends Command<Param, void> {
  constructor(private readonly repository: FeatureRequestsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { title, description, userId } = param
    const featureRequest = FeatureRequest.create({ title, description, userId })
    await this.repository.save(featureRequest)
  }
}
