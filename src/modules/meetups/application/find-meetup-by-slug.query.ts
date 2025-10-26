import { Query } from '@/modules/shared/application/use-case/query'
import { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Request {
  slug: Meetup['slug']
}

export class FindMeetupBySlugQuery extends Query<Meetup, Request> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  execute({ slug }: Request): Promise<Meetup> {
    return this.meetupsRepository.findBySlug(slug)
  }
}
