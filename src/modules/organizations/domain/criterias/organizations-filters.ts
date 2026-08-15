import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'

export interface OrganizationsFilters {
  name: FilterCriteria<string>
  location: FilterCriteria<string>
}
