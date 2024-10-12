import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { EventsCriteria } from './events-criteria'

export class NextEventsCriteria extends EventsCriteria {
  static create(): NextEventsCriteria {
    const now = Datetime.now()

    return EventsCriteria.create({ startsAt: OrderDirection.ASC })
      .or({
        endsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now },
      })
      .or({
        startsAt: { operator: RelationalOperator.LOWER_THAN_OR_EQUAL, value: now },
        endsAt: { operator: RelationalOperator.LOWER_THAN, value: now },
      })
  }
}
