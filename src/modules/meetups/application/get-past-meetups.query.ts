import { Query } from '@/modules/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { PastMeetupsCriteria } from '../domain/criterias/past-meetups-criteria'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface GetPastMeetupsRequest {
  count: number
  page?: number
}

export class GetPastMeetupsQuery extends Query<PaginatedResult<Meetup>, GetPastMeetupsRequest> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  execute({ count, page = 1 }: GetPastMeetupsRequest): Promise<PaginatedResult<Meetup>> {
    const criteria = PastMeetupsCriteria.withCount(count).andPage(page)
    return this.meetupsRepository.match(criteria)
  }
}
