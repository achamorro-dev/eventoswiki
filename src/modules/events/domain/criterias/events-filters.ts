import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'

export interface EventsFilters {
  title: FilterCriteria<string>
  startsAt: FilterCriteria<Date>
  endsAt: FilterCriteria<Date>
  location: FilterCriteria<string>
  organizationId: FilterCriteria<string>
}
