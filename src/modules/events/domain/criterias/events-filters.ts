import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'

export interface EventsFilters {
  startsAt: FilterCriteria<Date>
  endsAt: FilterCriteria<Date>
  location: FilterCriteria<string>
}
