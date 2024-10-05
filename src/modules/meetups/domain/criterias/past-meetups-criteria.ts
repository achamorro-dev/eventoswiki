import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { MeetupsCriteria } from './meetups-criteria'

export class PastMeetupsCriteria extends MeetupsCriteria {
  static withCount(count: number): PastMeetupsCriteria {
    const now = new Date()
    return MeetupsCriteria.create(
      {
        endsAt: { operator: RelationalOperator.LOWER_THAN_OR_EQUAL, value: now },
      },
      { endsAt: OrderDirection.DESC },
    ).withCount(count)
  }
}
