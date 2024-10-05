import { Criteria } from '@/shared/domain/criteria/criteria'
import type { MeetupsFilters } from './meetups-filters'
import type { MeetupsOrder } from './meetups-order'

export class MeetupsCriteria extends Criteria<Partial<MeetupsFilters>, Partial<MeetupsOrder>> {
  static create(filters: Partial<MeetupsFilters>, order: Partial<MeetupsOrder>): MeetupsCriteria {
    return new MeetupsCriteria(filters, order)
  }
}
