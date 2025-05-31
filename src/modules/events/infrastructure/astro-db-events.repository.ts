import { EventNotFound } from '@/events/domain/errors/event-not-found.ts'
import type { Filter } from '@/shared/domain/criteria/filter'
import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'
import { FilterType } from '@/shared/domain/criteria/filter-type'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { and, asc, count, db, desc, eq, Event, gt, gte, isDbError, like, lt, lte, ne, or, Province } from 'astro:db'
import type { EventsCriteria } from '../domain/criterias/events-criteria'
import type { EventsOrder } from '../domain/criterias/events-order'
import { EventAlreadyExists } from '../domain/errors/event-already-exists.error'
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

  async find(slug: EventEntity['slug']): Promise<EventEntity> {
    const result = await db
      .select()
      .from(Event)
      .leftJoin(Province, eq(Province.slug, Event.location))
      .where(eq(Event.slug, slug))
      .limit(1)
    if (!result.at(0)) {
      throw new EventNotFound(slug)
    }

    return AstroEventMapper.toDomain(result.at(0)!.Event, result.at(0)!.Province)
  }

  async findAll(): Promise<EventEntity[]> {
    const eventsAndProvinces = await db.select().from(Event).leftJoin(Province, eq(Province.slug, Event.location))
    return AstroEventMapper.toDomainList(eventsAndProvinces)
  }

  async save(value: EventEntity): Promise<void> {
    const event = await db.select().from(Event).where(eq(Event.id, value.id))
    const hasEvent = event.length !== 0

    return hasEvent ? this._updateEvent(value) : this._insertEvent(value)
  }

  private async _updateEvent(value: EventEntity): Promise<void | PromiseLike<void>> {
    try {
      await db.update(Event).set({
        slug: value.slug,
        title: value.title,
        shortDescription: value.shortDescription,
        startsAt: value.startsAt,
        endsAt: value.endsAt,
        image: value.image.toString(),
        location: value.location,
        web: value.web,
        twitter: value.twitter,
        linkedin: value.linkedin,
        youtube: value.youtube,
        twitch: value.twitch,
        facebook: value.facebook,
        instagram: value.instagram,
        github: value.github,
        telegram: value.telegram,
        whatsapp: value.whatsapp,
        discord: value.discord,
        tiktok: value.tiktok,
        tags: value.tags.length > 0 ? value.tags.join(',') : '',
        tagColor: value.tagColor,
        content: value.content,
      })
    } catch (error) {
      this._mapError(error, value)
    }
  }

  private async _insertEvent(value: EventEntity): Promise<void | PromiseLike<void>> {
    try {
      await db.insert(Event).values({
        id: value.id,
        slug: value.slug,
        title: value.title,
        shortDescription: value.shortDescription,
        startsAt: value.startsAt,
        endsAt: value.endsAt,
        image: value.image.toString(),
        location: value.location,
        web: value.web,
        twitter: value.twitter,
        linkedin: value.linkedin,
        youtube: value.youtube,
        twitch: value.twitch,
        facebook: value.facebook,
        instagram: value.instagram,
        github: value.github,
        telegram: value.telegram,
        whatsapp: value.whatsapp,
        discord: value.discord,
        tiktok: value.tiktok,
        tags: value.tags.length > 0 ? value.tags.join(',') : '',
        tagColor: value.tagColor,
        content: value.content,
        organizationId: value.organizationId,
      })
    } catch (error) {
      this._mapError(error, value)
    }
  }
  private _mapError(error: unknown, value: EventEntity) {
    if (isDbError(error)) {
      switch (error.code) {
        case 'SQLITE_CONSTRAINT_UNIQUE':
        case 'SQLITE_CONSTRAINT_PRIMARYKEY':
          throw new EventAlreadyExists(value.slug)
        default:
          throw error
      }
    }

    throw error
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
        .leftJoin(Province, eq(Province.slug, Event.location))
        //@ts-expect-error
        .where(...this.getEventsFiltersByCriteria(criteria))
    )
  }

  private getCountEventsQueryWithCriteria(criteria: EventsCriteria) {
    return (
      db
        .select({ count: count() })
        .from(Event)
        .leftJoin(Province, eq(Province.slug, Event.location))
        //@ts-ignore
        .where(...this.getEventsFiltersByCriteria(criteria))
    )
  }

  private getEventsFiltersByCriteria(criteria: EventsCriteria) {
    return this.getFiltersToApply(criteria.filters)
  }

  //@ts-expect-error return any, pending fix types
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
