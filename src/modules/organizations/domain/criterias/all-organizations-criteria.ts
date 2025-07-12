import { Filter } from '@/shared/domain/criteria/filter'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { OrganizationsCriteria } from './organizations-criteria'
import type { OrganizationsFilters } from './organizations-filters'

export class AllOrganizationsCriteria extends OrganizationsCriteria {
  static createWith(filters: { location?: string }): AllOrganizationsCriteria {
    return OrganizationsCriteria.create()
      .orderBy({ name: OrderDirection.ASC })
      .and([
        Filter.and<Partial<OrganizationsFilters>>({
          location: filters.location ? { operator: RelationalOperator.EQUALS, value: filters.location } : undefined,
        }),
      ])
  }
}
