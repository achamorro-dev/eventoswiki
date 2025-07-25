import { Command } from '@/shared/application/use-case/command'
import { MeetupNotFound } from '../domain/errors/meetup-not-found'
import { MeetupAttendeeId } from '../domain/meetup-attendee-id'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  userId: string
}

export class AttendMeetupCommand extends Command<Param, void> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { meetupId, userId } = param

    const meetup = await this.meetupsRepository.find(MeetupId.of(meetupId))
    if (!meetup) {
      throw new MeetupNotFound(meetupId)
    }

    meetup.addAttendee(MeetupAttendeeId.of(userId))
    await this.meetupsRepository.addAttendees(meetup)
  }
}
