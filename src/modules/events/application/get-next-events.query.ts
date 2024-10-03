import { Query } from '@/modules/shared/application/use-case/query'
import { NextEventsCriteria } from '../domain/criterias/next-events-criteria'
import type { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'

interface GetNextEventsRequest {
  count: number
  page?: number
}

export class GetNextEventsQuery extends Query<PaginatedResult<Event>, GetNextEventsRequest> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute({ count, page = 1 }: GetNextEventsRequest): Promise<PaginatedResult<Event>> {
    const criteria = NextEventsCriteria.withCount(count).andPage(page)
    return this.eventRepository.match(criteria)
  }
}
