import { Query } from '@/modules/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { NextMeetupsCriteria } from '../domain/criterias/next-meetups-criteria'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface GetNextMeetupsRequest {
  count: number
  page?: number
  location?: string
}

export class GetNextMeetupsQuery extends Query<PaginatedResult<Meetup>, GetNextMeetupsRequest> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  execute({ count, page = 1, location }: GetNextMeetupsRequest): Promise<PaginatedResult<Meetup>> {
    const criteria = NextMeetupsCriteria.createWith({ location }).withLimit(count).withPage(page)
    return this.meetupsRepository.match(criteria)
  }
}
