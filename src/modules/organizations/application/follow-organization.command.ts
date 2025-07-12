import { Command } from '@/shared/application/use-case/command'
import { OrganizationId } from '../domain/organization-id'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface Param {
  organizationId: string
  userId: string
}
export class FollowOrganizationCommand extends Command<Param, void> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const organizationId = new OrganizationId(param.organizationId)
    const organization = await this.organizationsRepository.find(organizationId)

    organization.addFollower(param.userId)

    await this.organizationsRepository.updateFollowers(organization)
  }
}
