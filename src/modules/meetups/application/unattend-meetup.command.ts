import { Command } from '@/shared/application/use-case/command'
import { MeetupNotFound } from '../domain/errors/meetup-not-found'
import { MeetupAttendeeId } from '../domain/meetup-attendee-id'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  userId: string
}

export class UnattendMeetupCommand extends Command<Param, void> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { meetupId, userId } = param

    const meetup = await this.meetupsRepository.find(MeetupId.of(meetupId))
    if (!meetup) {
      throw new MeetupNotFound(meetupId)
    }

    const attendee = MeetupAttendeeId.of(userId)
    meetup.removeAttendee(attendee)

    await this.meetupsRepository.removeAttendee(MeetupId.of(meetupId), attendee)
  }
}
