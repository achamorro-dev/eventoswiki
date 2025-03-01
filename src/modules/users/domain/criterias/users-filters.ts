import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'

export interface UsersFilters {
  email: FilterCriteria<string>
  username: FilterCriteria<string>
}
