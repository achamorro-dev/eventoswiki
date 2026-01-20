import { Command } from '@/shared/application/use-case/command'
import { CannotRemoveLastOrganizerError } from '../domain/errors/cannot-remove-last-organizer.error'
import { OnlyOrganizersCanRemoveOrganizersError } from '../domain/errors/only-organizers-can-remove-organizers.error'
import { OrganizationId } from '../domain/organization-id'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface RemoveOrganizerParam {
  organizationId: string
  organizerIdToRemove: string
  requesterId: string
}

export class RemoveOrganizerCommand extends Command<RemoveOrganizerParam, void> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  async execute(param: RemoveOrganizerParam): Promise<void> {
    const { organizationId, organizerIdToRemove, requesterId } = param

    const organization = await this.organizationsRepository.find(OrganizationId.of(organizationId))

    if (!organization.isOrganizer(requesterId)) {
      throw new OnlyOrganizersCanRemoveOrganizersError()
    }

    if (organization.organizers.length <= 1) {
      throw new CannotRemoveLastOrganizerError()
    }

    organization.removeOrganizer(organizerIdToRemove)

    await this.organizationsRepository.save(organization)
  }
}
