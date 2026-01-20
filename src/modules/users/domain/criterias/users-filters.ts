import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'

export interface UsersFilters {
  id: FilterCriteria<string>
  email: FilterCriteria<string>
  username: FilterCriteria<string>
  name: FilterCriteria<string>
}
