import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { EventsCriteria } from './events-criteria'

export class NextEventsCriteria extends EventsCriteria {
  static create(): NextEventsCriteria {
    const now = new Date()
    return EventsCriteria.create(
      { startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now } },
      { startsAt: OrderDirection.ASC },
    )
  }
}
