import { Query } from '@/shared/application/use-case/query'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { OrganizationsCriteria } from '../domain/criterias/organizations-criteria'
import type { Organization } from '../domain/organization'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface SearchOrganizationsRequest {
  query: string
  limit?: number
}

const DEFAULT_RESULTS_LIMIT = 5

export class SearchOrganizationsQuery extends Query<PaginatedResult<Organization>, SearchOrganizationsRequest> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  execute(request: SearchOrganizationsRequest): Promise<PaginatedResult<Organization>> {
    const { query, limit = DEFAULT_RESULTS_LIMIT } = request

    const criteria = OrganizationsCriteria.create({ name: OrderDirection.ASC }).withNameLike(query).withLimit(limit)

    return this.organizationsRepository.match(criteria)
  }
}
