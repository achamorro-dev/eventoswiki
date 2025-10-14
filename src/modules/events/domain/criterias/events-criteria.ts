import { Criteria } from '@/shared/domain/criteria/criteria'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import type { EventsFilters } from './events-filters'
import type { EventsOrder } from './events-order'

export class EventsCriteria extends Criteria<Partial<EventsFilters>, Partial<EventsOrder>> {
  static create(order?: Partial<EventsOrder>): EventsCriteria {
    return new EventsCriteria(order)
  }

  withLocation(location?: string): EventsCriteria {
    if (!location) return this

    this.and({ location: { operator: RelationalOperator.EQUALS, value: location } })
    return this
  }

  withOrganizationId(organizationId?: string): EventsCriteria {
    if (!organizationId) return this

    this.and({ organizationId: { operator: RelationalOperator.EQUALS, value: organizationId } })
    return this
  }

  withStartsAt(startsAt?: Date): EventsCriteria {
    if (!startsAt) return this

    this.and({ startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: startsAt } })
    return this
  }

  withEndsAt(endsAt?: Date): EventsCriteria {
    if (!endsAt) return this

    this.and({ endsAt: { operator: RelationalOperator.LOWER_THAN, value: endsAt } })
    return this
  }

  withStartsAndEndsAt(startsAt?: Date, endsAt?: Date): EventsCriteria {
    if (!startsAt || !endsAt) return this

    this.and({
      startsAt: { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: startsAt },
      endsAt: { operator: RelationalOperator.LOWER_THAN_OR_EQUAL, value: endsAt },
    })
    return this
  }
}
