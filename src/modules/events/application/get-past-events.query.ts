import { Query } from '@/modules/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { PastEventsCriteria } from '../domain/criterias/past-events-criteria'
import type { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface GetLastEventsRequest {
  count: number
  page?: number
  location?: string
}

export class GetPastEventsQuery extends Query<PaginatedResult<Event>, GetLastEventsRequest> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute({ count, page = 1, location }: GetLastEventsRequest): Promise<PaginatedResult<Event>> {
    const criteria = PastEventsCriteria.create().withLocation(location).withCount(count).andPage(page)

    return this.eventRepository.match(criteria)
  }
}
