import { Query } from '@/shared/application/use-case/query'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
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
      .withOrganizationId(organizationId)
      .withStartsAndEndsAt(startsAt, endsAt)
      .withLocation(province)
      .withLimit(limit)

    return this.meetupRepository.match(criteria)
  }
}
