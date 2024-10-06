import { Query } from '@/modules/shared/application/use-case/query'
import { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

export class GetEventsQuery extends Query<Array<Event>> {
  constructor(private readonly eventRepository: EventsRepository) {
    super()
  }

  execute(): Promise<Array<Event>> {
    return this.eventRepository.findAll()
  }
}
