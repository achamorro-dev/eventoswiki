import { Criteria } from '@/shared/domain/criteria/criteria'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import type { Slug } from '@/shared/domain/types/slug'
import type { EventsFilters } from './events-filters'
import type { EventsOrder } from './events-order'

export class EventsCriteria extends Criteria<Partial<EventsFilters>, Partial<EventsOrder>> {
  static create(filters: Partial<EventsFilters>, order: Partial<EventsOrder>): EventsCriteria {
    return new EventsCriteria(filters, order)
  }

  withLocation(location?: string): EventsCriteria {
    if (!location) return this

    this.addFilter({ location: { operator: RelationalOperator.EQUALS, value: location } })
    return this
  }
}
