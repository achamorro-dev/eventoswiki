import { Query } from '@/modules/shared/application/use-case/query'
import { Organization } from '../domain/organization'
import { OrganizationId } from '../domain/organization-id'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface GetOrganizationByIdRequest {
  id: string
}

export class GetOrganizationByIdQuery extends Query<Organization, GetOrganizationByIdRequest> {
  constructor(private readonly organizationRepository: OrganizationsRepository) {
    super()
  }

  execute({ id }: GetOrganizationByIdRequest): Promise<Organization> {
    return this.organizationRepository.find(new OrganizationId(id))
  }
}
