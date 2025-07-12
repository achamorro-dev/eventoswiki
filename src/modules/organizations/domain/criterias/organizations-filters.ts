import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'

export interface OrganizationsFilters {
  location: FilterCriteria<string>
}
