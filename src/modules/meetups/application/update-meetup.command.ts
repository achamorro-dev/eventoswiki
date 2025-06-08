import { Command } from '@/shared/application/use-case/command'
import { type MeetupData } from '../domain/meetup'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  data: MeetupData
}
export class UpdateMeetupCommand extends Command<Param, void> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { meetupId, data } = param

    const id = new MeetupId(meetupId)
    const meetup = await this.meetupsRepository.find(id)
    meetup.update(data)

    await this.meetupsRepository.save(meetup)
  }
}
