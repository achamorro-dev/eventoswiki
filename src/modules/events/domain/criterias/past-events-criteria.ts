import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { EventsCriteria } from './events-criteria'

export class PastEventsCriteria extends EventsCriteria {
  static createWith({ location }: { location?: string }): PastEventsCriteria {
    return EventsCriteria.create()
      .orderBy({ endsAt: OrderDirection.DESC, startsAt: OrderDirection.DESC })
      .and({
        startsAt: { operator: RelationalOperator.LOWER_THAN, value: Datetime.now() },
        location: location ? { operator: RelationalOperator.EQUALS, value: location } : undefined,
      })
  }
}
