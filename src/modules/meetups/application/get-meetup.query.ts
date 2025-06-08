import { Query } from '@/modules/shared/application/use-case/query'
import { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface GetMeetupRequest {
  slug: Meetup['slug']
}

export class GetMeetupQuery extends Query<Meetup, GetMeetupRequest> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  execute({ slug }: GetMeetupRequest): Promise<Meetup> {
    return this.meetupsRepository.findBySlug(slug)
  }
}
