import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import { type MeetupEditableData } from '../domain/meetup'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  data: MeetupEditableData
  userId: string
}
export class UpdateMeetupCommand extends Command<Param, void> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { meetupId, data, userId } = param

    const id = new MeetupId(meetupId)
    const meetup = await this.meetupsRepository.find(id)

    const organizationId = meetup.organizationId
    if (organizationId) {
      await this.userIsOrganizerEnsurer.ensure({ userId, organizationId: organizationId })
    }

    meetup.update(data)
    await this.meetupsRepository.save(meetup)
  }
}
