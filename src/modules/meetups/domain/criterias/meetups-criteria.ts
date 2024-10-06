import { Criteria } from '@/shared/domain/criteria/criteria'
import type { MeetupsFilters } from './meetups-filters'
import type { MeetupsOrder } from './meetups-order'
import type { Slug } from '@/shared/domain/types/slug'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'

export class MeetupsCriteria extends Criteria<Partial<MeetupsFilters>, Partial<MeetupsOrder>> {
  static create(filters: Partial<MeetupsFilters>, order: Partial<MeetupsOrder>): MeetupsCriteria {
    return new MeetupsCriteria(filters, order)
  }

  withLocation(location?: string): MeetupsCriteria {
    if (!location) return this

    this.addFilter({ location: { operator: RelationalOperator.EQUALS, value: location } })
    return this
  }
}
