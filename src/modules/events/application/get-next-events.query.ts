import { Query } from '@/modules/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { NextEventsCriteria } from '../domain/criterias/next-events-criteria'
import type { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface GetNextEventsRequest {
  count: number
  page?: number
  location?: string
}

export class GetNextEventsQuery extends Query<PaginatedResult<Event>, GetNextEventsRequest> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute(request: GetNextEventsRequest): Promise<PaginatedResult<Event>> {
    const { count, page = 1, location } = request
    const criteria = NextEventsCriteria.createWith({ location }).withLimit(count).withPage(page)

    return this.eventRepository.match(criteria)
  }
}
