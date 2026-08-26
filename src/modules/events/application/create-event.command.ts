import type { SendOrganizationEventCreatedEmailToFollowersCommand } from '@/emails/application/send-organization-event-created-email-to-followers.command'
import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import type { UserIsAdminEnsurer } from '@/users/application/user-is-admin-ensurer.service'
import { Event, type EventEditableData } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface Param {
  data: EventEditableData
  organizationId?: string
  userId: string
}
export class CreateEventCommand extends Command<Param, void> {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly userIsAdminEnsurer: UserIsAdminEnsurer,
    private readonly sendOrganizationEventCreatedEmailToFollowersCommand: SendOrganizationEventCreatedEmailToFollowersCommand,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizationId, data, userId } = param

    if (organizationId) {
      await this.userIsOrganizerEnsurer.ensure({ userId, organizationId })
    } else {
      await this.userIsAdminEnsurer.ensure({ userId })
    }

    const event = Event.create(data, organizationId)

    await this.eventsRepository.save(event)

    if (organizationId) {
      this.sendOrganizationEventCreatedEmailToFollowersCommand
        .execute({
          eventId: event.id.value,
          organizationId,
        })
        .catch(error => {
          console.error('[CreateEventCommand] Error sending email notification:', error)
        })
    }
  }
}
