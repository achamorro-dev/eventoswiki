import { Query } from '@/shared/application/use-case/query'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface GetUpcomingMeetupsAttendedByUserRequest {
  userId: string
  count?: number
  page?: number
}

export class GetUpcomingMeetupsAttendedByUserQuery extends Query<Meetup[], GetUpcomingMeetupsAttendedByUserRequest> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  async execute({ userId, count = 50, page = 1 }: GetUpcomingMeetupsAttendedByUserRequest): Promise<Meetup[]> {
    const meetups = await this.meetupsRepository.findMeetupsAttendedByUserId(userId)
    const now = new Date()
    return meetups
      .filter(meetup => meetup.startsAt >= now)
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
      .slice((page - 1) * count, page * count)
  }
}
