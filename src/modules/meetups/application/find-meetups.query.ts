import { Query } from '@/shared/application/use-case/query'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { MeetupsCriteria } from '../domain/criterias/meetups-criteria'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface FindMeetupsRequest {
  organizationId?: string
  startsAt?: Date
  endsAt?: Date
  province?: string
  limit?: number
}

export class FindMeetupsQuery extends Query<PaginatedResult<Meetup>, FindMeetupsRequest> {
  constructor(private readonly meetupRepository: MeetupsRepository) {
    super()
  }

  async execute(request: FindMeetupsRequest): Promise<PaginatedResult<Meetup>> {
    const { organizationId, startsAt, endsAt, province, limit } = request

    const criteria = MeetupsCriteria.create()
      .orderBy({ startsAt: OrderDirection.DESC })
      .and({
        organizationId: organizationId ? { operator: RelationalOperator.EQUALS, value: organizationId } : undefined,
        startsAt: startsAt ? { operator: RelationalOperator.GREATER_THAN_OR_EQUAL, value: startsAt } : undefined,
        endsAt: endsAt ? { operator: RelationalOperator.LOWER_THAN, value: endsAt } : undefined,
        location: province ? { operator: RelationalOperator.EQUALS, value: province } : undefined,
      })
      .withLimit(limit)

    return this.meetupRepository.match(criteria)
  }
}
