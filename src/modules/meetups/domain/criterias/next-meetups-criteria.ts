import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { Filter } from '@/shared/domain/criteria/filter'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { MeetupsCriteria } from './meetups-criteria'

export class NextMeetupsCriteria extends MeetupsCriteria {
  static createWith({ location }: { location?: string }): NextMeetupsCriteria {
    const now = Datetime.now()

    return MeetupsCriteria.create()
      .orderBy({ startsAt: OrderDirection.ASC, endsAt: OrderDirection.ASC })
      .and([
        Filter.or([
          Filter.and({
            startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now },
            endsAt: { operator: RelationalOperator.LOWER_THAN, value: now },
          }),
          Filter.and({ startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now } }),
        ]),
        Filter.and({
          location: location ? { operator: RelationalOperator.EQUALS, value: location } : undefined,
        }),
      ])
  }
}
