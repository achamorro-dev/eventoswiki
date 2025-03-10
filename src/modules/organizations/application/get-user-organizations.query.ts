import { Query } from '@/shared/application/use-case/query'
import type { Organization } from '../domain/organization'
import type { OrganizationsRepository } from '../domain/organizations.repository'

export class GetUserOrganizationsQuery extends Query<Organization[], { userId: string }> {
  constructor(private readonly organizationRepository: OrganizationsRepository) {
    super()
  }

  execute({ userId }: { userId: string }): Promise<Organization[]> {
    return this.organizationRepository.findOrganizationsByUserId(userId)
  }
}
