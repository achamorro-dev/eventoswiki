import { Command } from '@/shared/application/use-case/command'
import { OrganizationNotFound } from '../domain/errors/organization-not-found.error'
import { OrganizationId } from '../domain/organization-id'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface Param {
  organizationId: string
  userId: string
}
export class DeleteOrganizationCommand extends Command<Param, void> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizationId, userId } = param

    const organization = await this.organizationsRepository.find(OrganizationId.of(organizationId))
    if (!organization.isOrganizer(userId)) {
      throw new OrganizationNotFound(organizationId)
    }

    await this.organizationsRepository.delete(organization.id)
  }
}
