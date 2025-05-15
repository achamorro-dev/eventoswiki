import { Command } from '@/shared/application/use-case/command'
import type { OrganizationData } from '../domain/organization'
import { OrganizationId } from '../domain/organization-id'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface Param {
  organizationId: string
  data: OrganizationData
}
export class SaveOrganizationCommand extends Command<Param, void> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizationId, data } = param

    const organization = await this.organizationsRepository.find(OrganizationId.of(organizationId))
    organization.update(data)

    await this.organizationsRepository.save(organization)
  }
}
