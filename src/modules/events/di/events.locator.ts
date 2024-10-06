import { GetEventQuery } from '@/events/application/get-event.query.ts'
import { GetEventsQuery } from '../application/get-events.query'
import { GetNextEventsQuery } from '../application/get-next-events.query'
import { GetPastEventsQuery } from '../application/get-past-events.query'
import type { EventsRepository } from '../domain/events.repository'
import { AstroDbEventsRepository } from '../infrastructure/astro-db-events.repository'

export class EventsLocator {
  static getNextEventsQuery = (): GetNextEventsQuery => {
    return new GetNextEventsQuery(EventsLocator.createEventsRepository())
  }

  static getPastEventsQuery = (): GetPastEventsQuery => {
    return new GetPastEventsQuery(EventsLocator.createEventsRepository())
  }

  static getEventQuery = (): GetEventQuery => {
    return new GetEventQuery(EventsLocator.createEventsRepository())
  }

  static getEventsQuery = (): GetEventsQuery => {
    return new GetEventsQuery(EventsLocator.createEventsRepository())
  }

  private static createEventsRepository(): EventsRepository {
    return new AstroDbEventsRepository()
  }
}
