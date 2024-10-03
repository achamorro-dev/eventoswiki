import { EventNotFound } from '@/events/domain/errors/event-not-found.ts'
import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { and, asc, count, db, desc, eq, Event, gte, lte } from 'astro:db'
import type { EventsCriteria } from '../domain/criterias/events-criteria'
import type { EventsOrder } from '../domain/criterias/events-order'
import { Event as EventEntity } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'
import { AstroEventMapper } from './mappers/astro-db-event.mapper'

export class AstroDbEventsRepository implements EventsRepository {
  async match(criteria: EventsCriteria): Promise<PaginatedResult<EventEntity>> {
    const eventsQuery = this.getEventsWithCriteria(criteria).orderBy(...this.getOrderBy(criteria.order))
    const countQuery = this.getCountEventsWithCriteria(criteria)

    if (criteria.limit) {
      eventsQuery.limit(criteria.limit)
    }

    if (criteria.page) {
      eventsQuery.offset(criteria.page)
    }

    const events = await eventsQuery
    const count = await countQuery
    const totalPages = Math.ceil(count[0].count / criteria.limit)

    return new PaginatedResult(AstroEventMapper.toDomainList(events), totalPages, criteria.page, criteria.limit)
  }

  async find(id: string): Promise<EventEntity> {
    const result = await db.select().from(Event).where(eq(Event.slug, id)).limit(1)
    const event = result.at(0)
    if (!event) {
      throw new EventNotFound()
    }

    return AstroEventMapper.toDomain(event)
  }

  private getOrderBy(order: Partial<EventsOrder> | undefined) {
    const orderBy = []

    if (order?.startsAt === OrderDirection.ASC) {
      orderBy.push(asc(Event.startsAt))
    }

    if (order?.startsAt === OrderDirection.DESC) {
      orderBy.push(desc(Event.startsAt))
    }

    if (order?.endsAt === OrderDirection.ASC) {
      orderBy.push(asc(Event.endsAt))
    }

    if (order?.endsAt === OrderDirection.DESC) {
      orderBy.push(desc(Event.endsAt))
    }

    return orderBy
  }

  private getEventsWithCriteria(criteria: EventsCriteria) {
    return db
      .select()
      .from(Event)
      .where(and(this.getFilterByStartsAt(criteria), this.getFilterByEndsAt(criteria)))
  }

  private getCountEventsWithCriteria(criteria: EventsCriteria) {
    return db
      .select({ count: count() })
      .from(Event)
      .where(and(this.getFilterByStartsAt(criteria), this.getFilterByEndsAt(criteria)))
  }

  private getFilterByStartsAt(criteria: EventsCriteria) {
    const hasStartsAtFilter = criteria.filters?.startsAt !== undefined
    if (!hasStartsAtFilter) return undefined

    if (criteria.filters!.startsAt!.operator === RelationalOperator.GREATER_THAN_OR_EQUAL) {
      return gte(Event.startsAt, criteria.filters!.startsAt!.value)
    }

    if (criteria.filters!.startsAt!.operator === RelationalOperator.LOWER_THAN_OR_EQUAL) {
      return lte(Event.startsAt, criteria.filters!.startsAt!.value)
    }
  }

  private getFilterByEndsAt(criteria: EventsCriteria) {
    const hasEndsAtFilter = criteria.filters?.endsAt
    if (!hasEndsAtFilter) return undefined

    if (criteria.filters!.endsAt!.operator === RelationalOperator.GREATER_THAN_OR_EQUAL) {
      return gte(Event.endsAt, criteria.filters!.endsAt!.value)
    }

    if (criteria.filters!.endsAt!.operator === RelationalOperator.LOWER_THAN_OR_EQUAL) {
      return lte(Event.endsAt, criteria.filters!.endsAt!.value)
    }
  }
}
