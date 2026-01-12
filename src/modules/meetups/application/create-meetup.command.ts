import type { SendOrganizationMeetupCreatedEmailToFollowersCommand } from '@/emails/application/send-organization-meetup-created-email-to-followers.command'
import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import { Meetup, type MeetupEditableData } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  data: MeetupEditableData
  organizationId: string
  userId: string
}
export class CreateMeetupCommand extends Command<Param, void> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly sendOrganizationMeetupCreatedEmailToFollowersCommand: SendOrganizationMeetupCreatedEmailToFollowersCommand,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizationId, data, userId } = param

    await this.userIsOrganizerEnsurer.ensure({ userId, organizationId })

    const meetup = Meetup.create(data, organizationId)

    await this.meetupsRepository.save(meetup)

    this.sendOrganizationMeetupCreatedEmailToFollowersCommand
      .execute({
        meetupId: meetup.id.value,
        organizationId,
      })
      .catch(error => {
        console.error('[CreateMeetupCommand] Error sending email notification:', error)
      })
  }
}
