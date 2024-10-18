import { EventNotFound } from '@/events/domain/errors/event-not-found.ts'
import type { Filter } from '@/shared/domain/criteria/filter'
import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'
import { FilterType } from '@/shared/domain/criteria/filter-type'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { and, asc, count, db, desc, eq, Event, gt, gte, like, lt, lte, ne, or } from 'astro:db'
import type { EventsCriteria } from '../domain/criterias/events-criteria'
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
    return this.getFiltersToApply(criteria.filters)
  }

  //@ts-expect-error
  private getFiltersToApply<F>(parentFilters: F | Array<Filter<F>>) {
    if (!parentFilters) return []

    if (Array.isArray(parentFilters)) {
      return parentFilters.map((parentFilter: Filter<F>) => {
        const { type, filters } = parentFilter
        //@ts-ignore
        const criterias = this.getFiltersToApply(filters)
        return type === FilterType.AND ? and(...criterias) : or(...criterias)
      })
    }

    //@ts-ignore
    return Object.entries<FilterCriteria | undefined>(parentFilters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, eventFilter]) => {
        if (!eventFilter) return

        switch (eventFilter.operator) {
          case RelationalOperator.EQUALS:
            //@ts-ignore
            return eq(Event[key], eventFilter.value)
          case RelationalOperator.GREATER_THAN_OR_EQUAL:
            //@ts-ignore
            return gte(Event[key], eventFilter.value)
          case RelationalOperator.LOWER_THAN_OR_EQUAL:
            //@ts-ignore
            return lte(Event[key], eventFilter.value)
          case RelationalOperator.GREATER_THAN:
            //@ts-ignore
            return gt(Event[key], eventFilter.value)
          case RelationalOperator.LOWER_THAN:
            //@ts-ignore
            return lt(Event[key], eventFilter.value)
          case RelationalOperator.LIKE:
          case RelationalOperator.LIKE_NOT_SENSITIVE:
            //@ts-ignore
            return like(Event[key], eventFilter.value)
          case RelationalOperator.NOT_EQUALS:
            //@ts-ignore
            return ne(Event[key], eventFilter.value)
        }
      })
  }
}
