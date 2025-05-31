import { GetEventQuery } from '@/events/application/get-event.query.ts'
import { CreateEventCommand } from '../application/create-event.command'
import { FindEventsQuery } from '../application/find-events.query'
import { GetEventsQuery } from '../application/get-events.query'
import { GetNextEventsQuery } from '../application/get-next-events.query'
import { GetPastEventsQuery } from '../application/get-past-events.query'
import { UpdateEventCommand } from '../application/update-event.command'
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

  static updateEventCommand() {
    return new UpdateEventCommand(EventsLocator.createEventsRepository())
  }

  static createEventCommand() {
    return new CreateEventCommand(EventsLocator.createEventsRepository())
  }

  static findEventsQuery = (): FindEventsQuery => {
    return new FindEventsQuery(EventsLocator.createEventsRepository())
  }

  private static createEventsRepository(): EventsRepository {
    return new AstroDbEventsRepository()
  }
}
