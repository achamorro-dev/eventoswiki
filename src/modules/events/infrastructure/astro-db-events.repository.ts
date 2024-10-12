import { EventNotFound } from '@/events/domain/errors/event-not-found.ts'
import { FilterType } from '@/shared/domain/criteria/filter-type'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { and, asc, count, db, desc, eq, Event, gt, gte, lt, lte, or } from 'astro:db'
import type { EventsCriteria } from '../domain/criterias/events-criteria'
import type { EventsFilters } from '../domain/criterias/events-filters'
import type { EventsOrder } from '../domain/criterias/events-order'
import { Event as EventEntity } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'
import { AstroEventMapper } from './mappers/astro-db-event.mapper'

export class AstroDbEventsRepository implements EventsRepository {
  async match(criteria: EventsCriteria): Promise<PaginatedResult<EventEntity>> {
    const eventsQuery = this.getEventsQueryWithCriteria(criteria).orderBy(...this.getOrderBy(criteria.order))
    const countQuery = this.getCountEventsQueryWithCriteria(criteria)

    if (criteria.limit) {
      eventsQuery.limit(criteria.limit)
    }

    if (criteria.page) {
      eventsQuery.offset(criteria.offset)
    }

    const events = await eventsQuery
    const count = await countQuery
    const totalPages = Math.ceil(count[0].count / criteria.limit)

    return new PaginatedResult(AstroEventMapper.toDomainList(events), totalPages, criteria.page, criteria.limit)
  }

  async find(id: EventEntity['slug']): Promise<EventEntity> {
    const result = await db.select().from(Event).where(eq(Event.slug, id)).limit(1)
    const event = result.at(0)
    if (!event) {
      throw new EventNotFound()
    }

    return AstroEventMapper.toDomain(event)
  }

  async findAll(): Promise<EventEntity[]> {
    const events = await db.select().from(Event)
    return AstroEventMapper.toDomainList(events)
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

  private getEventsQueryWithCriteria(criteria: EventsCriteria) {
    return (
      db
        .select()
        .from(Event)
        //@ts-expect-error
        .where(...this.getEventsFiltersByCriteria(criteria))
    )
  }

  private getCountEventsQueryWithCriteria(criteria: EventsCriteria) {
    return (
      db
        .select({ count: count() })
        .from(Event)
        //@ts-ignore
        .where(...this.getEventsFiltersByCriteria(criteria))
    )
  }

  private getEventsFiltersByCriteria(criteria: EventsCriteria) {
    return criteria.filters.map(({ type, filters }) => {
      const filtersToApply = this.getFiltersToApply(filters)
      return type === FilterType.AND ? and(...filtersToApply) : or(...filtersToApply)
    })
  }

  private getFiltersToApply(filters: Partial<EventsFilters> | undefined) {
    if (!filters) return []

    return Object.entries(filters).map(([key, value]) => {
      //@ts-expect-error
      const tableKey = Event[key]
      switch (value.operator) {
        case RelationalOperator.EQUALS:
          return eq(tableKey, value.value)
        case RelationalOperator.GREATER_THAN_OR_EQUAL:
          return gte(tableKey, value.value)
        case RelationalOperator.LOWER_THAN_OR_EQUAL:
          return lte(tableKey, value.value)
        case RelationalOperator.GREATER_THAN:
          return gt(tableKey, value.value)
        case RelationalOperator.LOWER_THAN:
          return lt(tableKey, value.value)
      }
    })
  }
}
