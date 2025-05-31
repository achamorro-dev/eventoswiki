import { Query } from '@/shared/application/use-case/query'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { EventsCriteria } from '../domain/criterias/events-criteria'
import type { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface FindEventsRequest {
  organizationId: string
}

export class FindEventsQuery extends Query<PaginatedResult<Event>, FindEventsRequest> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute(request: FindEventsRequest): Promise<PaginatedResult<Event>> {
    const { organizationId } = request

    const criteria = EventsCriteria.create()
      .orderBy({ startsAt: OrderDirection.DESC })
      .withOrganizationId(organizationId)

    return this.eventRepository.match(criteria)
  }
}
