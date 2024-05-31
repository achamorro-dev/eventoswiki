import { Datetime } from '@/core/datetime/datetime'
import { OrderDirection } from '@/modules/shared/domain/criteria/order-direction'
import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { getCollection } from 'astro:content'
import type { EventsCriteria } from '../domain/criterias/events-criteria'
import type { EventsOrder } from '../domain/criterias/events-order'
import { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'
import type { AstroEventDto } from './dtos/astro-event-dto'
import { AstroEventMapper } from './mappers/astro-event-mapper'

export class AstroEventsRepository implements EventsRepository {
  async match(criteria: EventsCriteria): Promise<Event[]> {
    const astroEvents = await getCollection('events', event => this.filterEventsByCriteria(event, criteria))

    const sortedEvents = this.sortEventsByCriteriaOrder(astroEvents, criteria.order)

    return AstroEventMapper.toDomain(sortedEvents)
  }

  private filterEventsByCriteria(event: AstroEventDto, criteria: EventsCriteria): boolean {
    let result = false

    if (criteria.filters?.startsAt) {
      if (criteria.filters.startsAt.operator === RelationalOperator.GREATER_THAN_OR_EQUAL) {
        result = Datetime.isAfter(event.data.startsAt, criteria.filters.startsAt.value)
      }

      if (criteria.filters.startsAt.operator === RelationalOperator.LOWER_THAN_OR_EQUAL) {
        result = Datetime.isBefore(event.data.startsAt, criteria.filters.startsAt.value)
      }
    }

    if (criteria.filters?.endsAt) {
      if (criteria.filters.endsAt.operator === RelationalOperator.GREATER_THAN_OR_EQUAL) {
        result = Datetime.isAfter(event.data.endsAt, criteria.filters.endsAt.value)
      }

      if (criteria.filters.endsAt.operator === RelationalOperator.LOWER_THAN_OR_EQUAL) {
        result = Datetime.isBefore(event.data.endsAt, criteria.filters.endsAt.value)
      }
    }

    return result
  }

  private sortEventsByCriteriaOrder(astroEvents: AstroEventDto[], order?: Partial<EventsOrder>): AstroEventDto[] {
    if (!order) return astroEvents

    const sortedEvents = astroEvents.slice().sort((eventA, eventB) => {
      if (order.startsAt === OrderDirection.ASC) {
        return Datetime.compare(eventA.data.startsAt, eventB.data.startsAt)
      }

      if (order.startsAt === OrderDirection.DESC) {
        return Datetime.compare(eventB.data.startsAt, eventA.data.startsAt)
      }

      if (order.endsAt === OrderDirection.ASC) {
        return Datetime.compare(eventA.data.endsAt, eventB.data.endsAt)
      }

      if (order.endsAt === OrderDirection.DESC) {
        return Datetime.compare(eventB.data.endsAt, eventA.data.endsAt)
      }

      return 0
    })

    return sortedEvents
  }
}
