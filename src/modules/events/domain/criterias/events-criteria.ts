import { Criteria } from '@/shared/domain/criteria/criteria'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import type { EventsFilters } from './events-filters'
import type { EventsOrder } from './events-order'

export class EventsCriteria extends Criteria<Partial<EventsFilters>, Partial<EventsOrder>> {
  static create(order: Partial<EventsOrder>): EventsCriteria {
    return new EventsCriteria(order)
  }

  withLocation(location?: string): EventsCriteria {
    if (!location) return this

    this.and({ location: { operator: RelationalOperator.EQUALS, value: location } })
    return this
  }
}
