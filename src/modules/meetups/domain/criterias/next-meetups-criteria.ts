import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { MeetupsCriteria } from './meetups-criteria'

export class NextMeetupsCriteria extends MeetupsCriteria {
  static create(): NextMeetupsCriteria {
    const now = Datetime.now()

    return MeetupsCriteria.create({ startsAt: OrderDirection.ASC })
      .or({
        endsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now },
      })
      .or({
        startsAt: { operator: RelationalOperator.LOWER_THAN_OR_EQUAL, value: now },
        endsAt: { operator: RelationalOperator.LOWER_THAN, value: now },
      })
  }
}
