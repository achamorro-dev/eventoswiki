import { Query } from '@/shared/application/use-case/query'
import type { Meetup } from '../../domain/meetup'
import type { MeetupsRepository } from '../../domain/meetups.repository'

export class GetMeetupsAttendedByUserQuery extends Query<Meetup[], { userId: string }> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  async execute({ userId }: { userId: string }): Promise<Meetup[]> {
    return this.meetupsRepository.findMeetupsAttendedByUserId(userId)
  }
}
