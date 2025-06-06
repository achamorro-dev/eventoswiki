import { Query } from '@/shared/application/use-case/query'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface FindMeetupsRequest {
  organizationId: string
}

export class FindMeetupsQuery extends Query<PaginatedResult<Meetup>, FindMeetupsRequest> {
  constructor(private readonly meetupRepository: MeetupsRepository) {
    super()
  }

  async execute(param: FindMeetupsRequest): Promise<PaginatedResult<Meetup>> {
    return new PaginatedResult<Meetup>([], 0, 0, 0)
  }
}
