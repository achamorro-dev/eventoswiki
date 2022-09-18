import { Datetime } from '../datetime/datetime'
import type { AstroEvent } from './astro-event'

export class EventUtils {
  static getNextEvents(events: AstroEvent[]): AstroEvent[] {
    return events.filter((event) => {
      if (!event.frontmatter.startDate) return false

      return Datetime.isAfterYesterday(event.frontmatter.startDate)
    })
  }

  static getLastEvents(events: AstroEvent[]): AstroEvent[] {
    return events.filter((event) => {
      if (!event.frontmatter.startDate) return false

      return Datetime.isBeforeToday(event.frontmatter.startDate)
    })
  }

  static sortByStartDateAsc(events: AstroEvent[]): AstroEvent[] {
    return events.sort((eventA, eventB) => {
      return Datetime.sortByDateAsc(
        eventA.frontmatter.startDate,
        eventB.frontmatter.startDate
      )
    })
  }

  static sortByStartDateDesc(events: AstroEvent[]): AstroEvent[] {
    return events.sort((eventA, eventB) => {
      return Datetime.sortByDateDesc(
        eventA.frontmatter.startDate,
        eventB.frontmatter.startDate
      )
    })
  }
}
