import { Criteria } from '@/shared/domain/criteria/criteria'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import type { MeetupsFilters } from './meetups-filters'
import type { MeetupsOrder } from './meetups-order'

export class MeetupsCriteria extends Criteria<Partial<MeetupsFilters>, Partial<MeetupsOrder>> {
  static create(order: Partial<MeetupsOrder>): MeetupsCriteria {
    return new MeetupsCriteria(order)
  }

  withLocation(location?: string): MeetupsCriteria {
    if (!location) return this

    this.and({ location: { operator: RelationalOperator.EQUALS, value: location } })
    return this
  }
}
