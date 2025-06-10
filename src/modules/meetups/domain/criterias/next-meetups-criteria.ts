import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { Filter } from '@/shared/domain/criteria/filter'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { MeetupsCriteria } from './meetups-criteria'
import type { MeetupsFilters } from './meetups-filters'

export class NextMeetupsCriteria extends MeetupsCriteria {
  static createWith(filters: { location?: string }): NextMeetupsCriteria {
    const now = Datetime.now()

    return MeetupsCriteria.create()
      .orderBy({ startsAt: OrderDirection.ASC, endsAt: OrderDirection.ASC })
      .and([
        Filter.or<Partial<MeetupsFilters>>([
          Filter.and({
            startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now },
            endsAt: { operator: RelationalOperator.LOWER_THAN, value: now },
          }),
          Filter.and({
            endsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now },
          }),
        ]),
        Filter.and<Partial<MeetupsFilters>>({
          location: filters.location ? { operator: RelationalOperator.EQUALS, value: filters.location } : undefined,
        }),
      ])
  }
}
