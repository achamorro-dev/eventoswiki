import { Query } from '@/modules/shared/application/use-case/query'
import { Event } from '../domain/event'
import { EventId } from '../domain/event-id'
import type { EventsRepository } from '../domain/events.repository'

interface Request {
  id: string
}

export class FindEventQuery extends Query<Event, Request> {
  constructor(private readonly eventsRepository: EventsRepository) {
    super()
  }

  execute({ id }: Request): Promise<Event> {
    return this.eventsRepository.find(EventId.of(id))
  }
}
