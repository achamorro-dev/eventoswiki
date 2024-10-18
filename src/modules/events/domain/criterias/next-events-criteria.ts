import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { Filter } from '@/shared/domain/criteria/filter'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { EventsCriteria } from './events-criteria'
import type { EventsFilters } from './events-filters'

export class NextEventsCriteria extends EventsCriteria {
  static createWith(filters: { location?: string }): NextEventsCriteria {
    const now = Datetime.now()

    return EventsCriteria.create()
      .orderBy({ startsAt: OrderDirection.ASC, endsAt: OrderDirection.ASC })
      .and([
        Filter.or<Partial<EventsFilters>>([
          Filter.and({
            startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now },
            endsAt: { operator: RelationalOperator.LOWER_THAN, value: now },
          }),
          Filter.and({
            endsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now },
          }),
        ]),
        Filter.and<Partial<EventsFilters>>({
          location: filters.location ? { operator: RelationalOperator.EQUALS, value: filters.location } : undefined,
        }),
      ])
  }
}
