import { Query } from '@/modules/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { PastMeetupsCriteria } from '../domain/criterias/past-meetups-criteria'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface GetPastMeetupsRequest {
  count: number
  page?: number
  location?: string
}

export class GetPastMeetupsQuery extends Query<PaginatedResult<Meetup>, GetPastMeetupsRequest> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  execute({ count, page = 1, location }: GetPastMeetupsRequest): Promise<PaginatedResult<Meetup>> {
    const criteria = PastMeetupsCriteria.createWith({ location }).withCount(count).withPage(page)
    return this.meetupsRepository.match(criteria)
  }
}
