import { Query } from '@/modules/shared/application/use-case/query'
import { NextEventsCriteria } from '../domain/criterias/next-events-criteria'
import type { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface GetNextEventsRequest {
  count: number
}

export class GetNextEventsQuery extends Query<Array<Event>, GetNextEventsRequest> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute({ count }: GetNextEventsRequest): Promise<Array<Event>> {
    const criteria = NextEventsCriteria.withCount(count)
    return this.eventRepository.match(criteria)
  }
}
