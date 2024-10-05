import { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { Meetup, and, asc, count, db, desc, eq, gte, lte } from 'astro:db'
import type { MeetupsCriteria } from '../domain/criterias/meetups-criteria'
import type { MeetupsOrder } from '../domain/criterias/meetups-order'
import { MeetupNotFound } from '../domain/errors/meetup-not-found'
import { Meetup as MeetupEntity } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'
import { AstroDbMeetupMapper } from './mappers/astro-db-meetup.mapper'

export class AstroDbMeetupsRepository implements MeetupsRepository {
  async match(criteria: MeetupsCriteria): Promise<PaginatedResult<MeetupEntity>> {
    const meetupsQuery = this.getMeetupsWithCriteria(criteria).orderBy(...this.getOrderBy(criteria.order))
    const countQuery = this.getCountEventsWithCriteria(criteria)

    if (criteria.limit) {
      meetupsQuery.limit(criteria.limit)
    }

    if (criteria.page) {
      meetupsQuery.offset(criteria.page)
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
    return db
      .select()
      .from(Meetup)
      .where(and(this.getFilterByStartsAt(criteria), this.getFilterByEndsAt(criteria)))
  }

  private getCountEventsWithCriteria(criteria: MeetupsCriteria) {
    return db
      .select({ count: count() })
      .from(Meetup)
      .where(and(this.getFilterByStartsAt(criteria), this.getFilterByEndsAt(criteria)))
  }

  private getFilterByStartsAt(criteria: MeetupsCriteria) {
    const hasStartsAtFilter = criteria.filters?.startsAt !== undefined
    if (!hasStartsAtFilter) return undefined

    if (criteria.filters!.startsAt!.operator === RelationalOperator.GREATER_THAN_OR_EQUAL) {
      return gte(Meetup.startsAt, criteria.filters!.startsAt!.value)
    }

    if (criteria.filters!.startsAt!.operator === RelationalOperator.LOWER_THAN_OR_EQUAL) {
      return lte(Meetup.startsAt, criteria.filters!.startsAt!.value)
    }
  }

  private getFilterByEndsAt(criteria: MeetupsCriteria) {
    const hasEndsAtFilter = criteria.filters?.endsAt
    if (!hasEndsAtFilter) return undefined

    if (criteria.filters!.endsAt!.operator === RelationalOperator.GREATER_THAN_OR_EQUAL) {
      return gte(Meetup.endsAt, criteria.filters!.endsAt!.value)
    }

    if (criteria.filters!.endsAt!.operator === RelationalOperator.LOWER_THAN_OR_EQUAL) {
      return lte(Meetup.endsAt, criteria.filters!.endsAt!.value)
    }
  }
}
