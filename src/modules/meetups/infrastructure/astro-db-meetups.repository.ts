import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { FilterType } from '@/shared/domain/criteria/filter-type'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { Meetup, and, asc, count, db, desc, eq, gt, gte, lt, lte, or } from 'astro:db'
import type { MeetupsCriteria } from '../domain/criterias/meetups-criteria'
import type { MeetupsFilters } from '../domain/criterias/meetups-filters'
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
    return criteria.filters.map(({ type, filters }) => {
      const filtersToApply = this.getFiltersToApply(filters)
      return type === FilterType.AND ? and(...filtersToApply) : or(...filtersToApply)
    })
  }

  private getFiltersToApply(filters: Partial<MeetupsFilters> | undefined) {
    if (!filters) return []

    return Object.entries(filters).map(([key, value]) => {
      //@ts-expect-error
      const tableKey = Meetup[key]
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
