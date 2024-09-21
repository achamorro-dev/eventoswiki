import { GetLastEventsQuery } from '../application/get-last-events.query'
import { GetNextEventsQuery } from '../application/get-next-events.query'
import type { EventsRepository } from '../domain/events.repository'
import { AstroDbEventsRepository } from '../infrastructure/astro-db-events.repository'

export class EventsLocator {
  static getNextEventsQuery = (): GetNextEventsQuery => {
    return new GetNextEventsQuery(EventsLocator.createEventsRepository())
  }

  static getLastEventsQuery = (): GetLastEventsQuery => {
    return new GetLastEventsQuery(EventsLocator.createEventsRepository())
  }

  private static createEventsRepository(): EventsRepository {
    return new AstroDbEventsRepository()
  }
}
