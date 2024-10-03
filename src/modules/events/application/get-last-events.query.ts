import { Query } from '@/modules/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { PastEventsCriteria } from '../domain/criterias/last-events-criteria'
import type { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface GetLastEventsRequest {
  count: number
}

export class GetLastEventsQuery extends Query<PaginatedResult<Event>, GetLastEventsRequest> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute({ count }: GetLastEventsRequest): Promise<PaginatedResult<Event>> {
    const criteria = PastEventsCriteria.withCount(count)
    return this.eventRepository.match(criteria)
  }
}
