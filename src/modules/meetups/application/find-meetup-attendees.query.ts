import { Query } from '@/modules/shared/application/use-case/query'
import type { MeetupsRepository } from '../domain/meetups.repository'
import type { MeetupAttendee } from '../domain/meetup-attendee'

export class FindMeetupAttendeesQuery extends Query<MeetupAttendee[], string> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  async execute(meetupId: string): Promise<MeetupAttendee[]> {
    return this.meetupsRepository.findAllAttendees(meetupId)
  }
}

