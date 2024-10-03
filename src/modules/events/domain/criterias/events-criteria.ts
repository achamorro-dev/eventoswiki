import { Criteria } from '@/shared/domain/criteria/criteria'
import type { EventsFilters } from './events-filters'
import type { EventsOrder } from './events-order'

export class EventsCriteria extends Criteria<Partial<EventsFilters>, Partial<EventsOrder>> {
  static create(filters: Partial<EventsFilters>, order: Partial<EventsOrder>): EventsCriteria {
    return new EventsCriteria(filters, order)
  }
}
