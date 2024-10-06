import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { EventsCriteria } from './events-criteria'

export class PastEventsCriteria extends EventsCriteria {
  static create(): PastEventsCriteria {
    const now = new Date()
    return EventsCriteria.create(
      {
        endsAt: { operator: RelationalOperator.LOWER_THAN_OR_EQUAL, value: now },
      },
      { endsAt: OrderDirection.DESC },
    )
  }
}
