import { Query } from '@/modules/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { AllOrganizationsCriteria } from '../domain/criterias/all-organizations-criteria'
import type { Organization } from '../domain/organization'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface MatchOrganizationsRequest {
  count: number
  page?: number
  location?: string
}

export class MatchOrganizationsQuery extends Query<PaginatedResult<Organization>, MatchOrganizationsRequest> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  execute(request: MatchOrganizationsRequest): Promise<PaginatedResult<Organization>> {
    const { count, page = 1, location } = request
    const criteria = AllOrganizationsCriteria.createWith({ location }).withLimit(count).withPage(page)

    return this.organizationsRepository.match(criteria)
  }
}
