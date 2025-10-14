import { Query } from '@/shared/application/use-case/query'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'
import { MeetupsCriteria } from '../domain/criterias/meetups-criteria'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'

interface FindMeetupsRequest {
  organizationId?: string
  startsAt?: Date
  endsAt?: Date
  limit?: number
}

export class FindMeetupsQuery extends Query<PaginatedResult<Meetup>, FindMeetupsRequest> {
  constructor(private readonly meetupRepository: MeetupsRepository) {
    super()
  }

  async execute(request: FindMeetupsRequest): Promise<PaginatedResult<Meetup>> {
    const { organizationId, startsAt, endsAt, limit } = request

    const criteria = MeetupsCriteria.create()
      .orderBy({ startsAt: OrderDirection.DESC })
      .withOrganizationId(organizationId)
      .withStartsAndEndsAt(startsAt, endsAt)
      .withLimit(limit)

    return this.meetupRepository.match(criteria)
  }
}
