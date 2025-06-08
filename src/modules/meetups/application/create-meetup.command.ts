import { Command } from '@/shared/application/use-case/command'
import { Meetup, type MeetupData } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  data: MeetupData
  organizationId: string
}
export class CreateMeetupCommand extends Command<Param, void> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizationId, data } = param

    const meetup = Meetup.create(data, organizationId)

    await this.meetupsRepository.save(meetup)
  }
}
