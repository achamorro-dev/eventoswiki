import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { MeetupsCriteria } from './meetups-criteria'

export class NextMeetupsCriteria extends MeetupsCriteria {
  static withCount(count: number): NextMeetupsCriteria {
    const now = new Date()
    return MeetupsCriteria.create(
      { startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now } },
      { startsAt: OrderDirection.ASC },
    ).withCount(count)
  }
}
