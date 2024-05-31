import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { EventsCriteria } from './events-criteria'

export class NextEventsCriteria extends EventsCriteria {
  static withCount(count: number): NextEventsCriteria {
    const now = new Date()
    return new NextEventsCriteria(
      { startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: now } },
      { startsAt: OrderDirection.ASC },
      count,
    )
  }
}
