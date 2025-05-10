import { Query } from '@/modules/shared/application/use-case/query'
import { Organization } from '../domain/organization'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface GetOrganizationRequest {
  handle: Organization['handle']
}

export class GetOrganizationQuery extends Query<Organization, GetOrganizationRequest> {
  constructor(private readonly organizationRepository: OrganizationsRepository) {
    super()
  }

  execute({ handle }: GetOrganizationRequest): Promise<Organization> {
    return this.organizationRepository.find(handle)
  }
}
