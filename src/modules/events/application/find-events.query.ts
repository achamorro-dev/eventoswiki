import { Query } from '@/shared/application/use-case/query'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { EventsCriteria } from '../domain/criterias/events-criteria'
import type { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface FindEventsRequest {
  organizationId?: string
  startsAt?: Date
  endsAt?: Date
  province?: string
  limit?: number
}

export class FindEventsQuery extends Query<PaginatedResult<Event>, FindEventsRequest> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute(request: FindEventsRequest): Promise<PaginatedResult<Event>> {
    const { organizationId, startsAt, endsAt, province, limit } = request

    const criteria = EventsCriteria.create()
      .orderBy({ startsAt: OrderDirection.DESC })
      .and({
        organizationId: organizationId ? { operator: RelationalOperator.EQUALS, value: organizationId } : undefined,
        startsAt: startsAt ? { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: startsAt } : undefined,
        endsAt: endsAt ? { operator: RelationalOperator.LOWER_THAN, value: endsAt } : undefined,
        location: province ? { operator: RelationalOperator.EQUALS, value: province } : undefined,
      })
      .withLimit(limit)

    return this.eventRepository.match(criteria)
  }
}
