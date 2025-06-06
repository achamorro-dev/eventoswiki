import { Query } from '@/modules/shared/application/use-case/query'
import { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface GetEventRequest {
  slug: Event['slug']
}

export class GetEventQuery extends Query<Event, GetEventRequest> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute({ slug }: GetEventRequest): Promise<Event> {
    return this.eventRepository.findBySlug(slug)
  }
}
