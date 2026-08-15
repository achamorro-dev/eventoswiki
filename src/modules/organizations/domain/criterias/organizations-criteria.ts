import { Criteria } from '@/shared/domain/criteria/criteria'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import type { OrganizationsFilters } from './organizations-filters'
import type { OrganizationsOrder } from './organizations-order'

export class OrganizationsCriteria extends Criteria<Partial<OrganizationsFilters>, Partial<OrganizationsOrder>> {
  static create(order?: Partial<OrganizationsOrder>): OrganizationsCriteria {
    return new OrganizationsCriteria(order)
  }

  withNameLike(name?: string): OrganizationsCriteria {
    if (!name) return this

    const searchPattern = `%${name.replace(/\s+/g, '%')}%`
    this.and({ name: { operator: RelationalOperator.LIKE, value: searchPattern } })
    return this
  }

  withLocation(location?: string): OrganizationsCriteria {
    if (!location) return this

    this.and({ location: { operator: RelationalOperator.EQUALS, value: location } })
    return this
  }
}
