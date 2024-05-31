import { GetNextEventsQuery } from '../application/get-next-events.query'
import { GetLastEventsQuery } from '../application/get-last-events.query'
import { AstroEventsRepository } from '../infrastructure/astro-events.repository'

export class EventsLocator {
  static getNextEventsQuery = (): GetNextEventsQuery => {
    return new GetNextEventsQuery(new AstroEventsRepository())
  }

  static getLastEventsQuery = (): GetLastEventsQuery => {
    return new GetLastEventsQuery(new AstroEventsRepository())
  }
}
