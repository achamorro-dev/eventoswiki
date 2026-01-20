import { Command } from '@/shared/application/use-case/command'
import { OnlyOrganizersCanAddOrganizersError } from '../domain/errors/only-organizers-can-add-organizers.error'
import { OrganizationId } from '../domain/organization-id'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface AddOrganizerParam {
  organizationId: string
  organizerId: string
  requesterId: string
}

export class AddOrganizerCommand extends Command<AddOrganizerParam, void> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  async execute(param: AddOrganizerParam): Promise<void> {
    const { organizationId, organizerId, requesterId } = param

    const organization = await this.organizationsRepository.find(OrganizationId.of(organizationId))

    if (!organization.isOrganizer(requesterId)) {
      throw new OnlyOrganizersCanAddOrganizersError()
    }

    organization.addOrganizer(organizerId)

    await this.organizationsRepository.save(organization)
  }
}
