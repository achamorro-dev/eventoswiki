import { Command } from '@/shared/application/use-case/command'
import { Organization, type OrganizationEditableData } from '../domain/organization'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface Param {
  data: OrganizationEditableData
  organizerId: string
}
export class CreateOrganizationCommand extends Command<Param, void> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizerId, data } = param

    const organization = Organization.create(data)
    organization.addOrganizer(organizerId)

    await this.organizationsRepository.save(organization)
  }
}
