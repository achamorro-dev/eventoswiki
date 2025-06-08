import { Query } from '@/shared/application/use-case/query'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'
import { MeetupsCriteria } from '../domain/criterias/meetups-criteria'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'

interface FindMeetupsRequest {
  organizationId: string
}

export class FindMeetupsQuery extends Query<PaginatedResult<Meetup>, FindMeetupsRequest> {
  constructor(private readonly meetupRepository: MeetupsRepository) {
    super()
  }

  async execute(request: FindMeetupsRequest): Promise<PaginatedResult<Meetup>> {
    const { organizationId } = request

    const criteria = MeetupsCriteria.create()
      .orderBy({ startsAt: OrderDirection.DESC })
      .withOrganizationId(organizationId)

    return this.meetupRepository.match(criteria)
  }
}
