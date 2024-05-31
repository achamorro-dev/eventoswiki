import { Criteria } from '../../../shared/domain/criteria/criteria'
import type { Event } from '../event'
import type { EventsFilters } from './events-filters'
import type { EventsOrder } from './events-order'

export class EventsCriteria implements Criteria<Partial<EventsFilters>, Partial<EventsOrder>, Event['id']> {
  protected constructor(
    public filters?: Partial<EventsFilters>,
    public order?: Partial<EventsOrder>,
    public limit?: number,
    public offset?: string,
  ) {}

  static create(filters: Partial<EventsFilters>, order: Partial<EventsOrder>): EventsCriteria {
    return new EventsCriteria(filters, order)
  }
}
