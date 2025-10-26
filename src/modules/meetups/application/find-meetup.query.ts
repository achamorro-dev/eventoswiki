import { Query } from '@/modules/shared/application/use-case/query'
import { Meetup } from '../domain/meetup'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Request {
  id: string
}

export class FindMeetupQuery extends Query<Meetup, Request> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  execute({ id }: Request): Promise<Meetup> {
    return this.meetupsRepository.find(MeetupId.of(id))
  }
}
