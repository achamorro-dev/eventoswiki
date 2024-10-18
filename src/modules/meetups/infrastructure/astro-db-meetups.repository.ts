import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import type { Filter } from '@/shared/domain/criteria/filter'
import { FilterType } from '@/shared/domain/criteria/filter-type'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { Meetup, and, asc, count, db, desc, eq, gt, gte, lt, lte, or } from 'astro:db'
import type { MeetupsCriteria } from '../domain/criterias/meetups-criteria'
import type { MeetupsOrder } from '../domain/criterias/meetups-order'
import { MeetupNotFound } from '../domain/errors/meetup-not-found'
import { Meetup as MeetupEntity } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'
import { AstroDbMeetupMapper } from './mappers/astro-db-meetup.mapper'

export class AstroDbMeetupsRepository implements MeetupsRepository {
  async match(criteria: MeetupsCriteria): Promise<PaginatedResult<MeetupEntity>> {
    const meetupsQuery = this.getMeetupsWithCriteria(criteria).orderBy(...this.getOrderBy(criteria.order))
    const countQuery = this.getCountMeetupsWithCriteria(criteria)

    if (criteria.limit) {
      meetupsQuery.limit(criteria.limit)
    }

    if (criteria.page) {
      meetupsQuery.offset(criteria.offset)
    }

    const meetups = await meetupsQuery
    const count = await countQuery
    const totalPages = Math.ceil(count[0].count / criteria.limit)

    return new PaginatedResult(AstroDbMeetupMapper.toDomainList(meetups), totalPages, criteria.page, criteria.limit)
  }

  async find(id: string): Promise<MeetupEntity> {
    const result = await db.select().from(Meetup).where(eq(Meetup.slug, id)).limit(1)
    const meetup = result.at(0)
    if (!meetup) {
      throw new MeetupNotFound()
    }

    return AstroDbMeetupMapper.toDomain(meetup)
  }

  async findAll(): Promise<MeetupEntity[]> {
    const meetups = await db.select().from(Meetup)
    return AstroDbMeetupMapper.toDomainList(meetups)
  }

  private getOrderBy(order: Partial<MeetupsOrder> | undefined) {
    const orderBy = []

    if (order?.startsAt === OrderDirection.ASC) {
      orderBy.push(asc(Meetup.startsAt))
    }

    if (order?.startsAt === OrderDirection.DESC) {
      orderBy.push(desc(Meetup.startsAt))
    }

    if (order?.endsAt === OrderDirection.ASC) {
      orderBy.push(asc(Meetup.endsAt))
    }

    if (order?.endsAt === OrderDirection.DESC) {
      orderBy.push(desc(Meetup.endsAt))
    }

    return orderBy
  }

  private getMeetupsWithCriteria(criteria: MeetupsCriteria) {
    return (
      db
        .select()
        .from(Meetup)
        //@ts-ignore
        .where(...this.getMeetupsFiltersByCriteria(criteria))
    )
  }

  private getCountMeetupsWithCriteria(criteria: MeetupsCriteria) {
    return (
      db
        .select({ count: count() })
        .from(Meetup)
        //@ts-ignore
        .where(...this.getMeetupsFiltersByCriteria(criteria))
    )
  }

  private getMeetupsFiltersByCriteria(criteria: MeetupsCriteria) {
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
            return eq(Meetup[key], eventFilter.value)
          case RelationalOperator.GREATER_THAN_OR_EQUAL:
            //@ts-ignore
            return gte(Meetup[key], eventFilter.value)
          case RelationalOperator.LOWER_THAN_OR_EQUAL:
            //@ts-ignore
            return lte(Meetup[key], eventFilter.value)
          case RelationalOperator.GREATER_THAN:
            //@ts-ignore
            return gt(Meetup[key], eventFilter.value)
          case RelationalOperator.LOWER_THAN:
            //@ts-ignore
            return lt(Meetup[key], eventFilter.value)
          case RelationalOperator.LIKE:
          case RelationalOperator.LIKE_NOT_SENSITIVE:
            //@ts-ignore
            return like(Meetup[key], eventFilter.value)
          case RelationalOperator.NOT_EQUALS:
            //@ts-ignore
            return ne(Meetup[key], eventFilter.value)
        }
      })
  }
}
