import { Criteria } from '@/shared/domain/criteria/criteria'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import type { MeetupsFilters } from './meetups-filters'
import type { MeetupsOrder } from './meetups-order'

export class MeetupsCriteria extends Criteria<Partial<MeetupsFilters>, Partial<MeetupsOrder>> {
  static create(order?: Partial<MeetupsOrder>): MeetupsCriteria {
    return new MeetupsCriteria(order)
  }

  withLocation(location?: string): MeetupsCriteria {
    if (!location) return this

    this.and({ location: { operator: RelationalOperator.EQUALS, value: location } })
    return this
  }

  withOrganizationId(organizationId?: string): MeetupsCriteria {
    if (!organizationId) return this

    this.and({ organizationId: { operator: RelationalOperator.EQUALS, value: organizationId } })
    return this
  }

  withStartsAt(startsAt: Date | undefined) {
    if (!startsAt) return this

    this.and({ startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: startsAt } })
    return this
  }

  withEndsAt(endsAt: Date | undefined) {
    if (!endsAt) return this

    this.and({ endsAt: { operator: RelationalOperator.LOWER_THAN, value: endsAt } })
    return this
  }

  withStartsAndEndsAt(startsAt?: Date, endsAt?: Date) {
    if (!startsAt || !endsAt) return this

    this.and({
      startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: startsAt },
      endsAt: { operator: RelationalOperator.LOWER_THAN_OR_EQUAL, value: endsAt },
    })
    return this
  }
}
