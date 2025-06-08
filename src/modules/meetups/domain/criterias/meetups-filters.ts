import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'

export interface MeetupsFilters {
  startsAt: FilterCriteria<Date>
  endsAt: FilterCriteria<Date>
  location: FilterCriteria<string>
  organizationId: FilterCriteria<string>
}
