import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import type { UserIsAdminEnsurer } from '@/users/application/user-is-admin-ensurer.service'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  userId: string
}
export class DeleteMeetupCommand extends Command<Param, void> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly userIsAdminEnsurer: UserIsAdminEnsurer,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { meetupId, userId } = param

    const meetup = await this.meetupsRepository.find(MeetupId.of(meetupId))

    const organizationId = meetup.organizationId
    if (organizationId) {
      await this.userIsOrganizerEnsurer.ensure({ userId, organizationId: organizationId })
    } else {
      await this.userIsAdminEnsurer.ensure({ userId })
    }

    await this.meetupsRepository.delete(meetup.id)
  }
}
