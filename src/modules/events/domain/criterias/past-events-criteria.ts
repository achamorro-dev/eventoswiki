import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { EventsCriteria } from './events-criteria'

export class PastEventsCriteria extends EventsCriteria {
  static create(): PastEventsCriteria {
    return EventsCriteria.create({ endsAt: OrderDirection.DESC }).and({
      startsAt: { operator: RelationalOperator.LOWER_THAN, value: Datetime.now() },
    })
  }
}
