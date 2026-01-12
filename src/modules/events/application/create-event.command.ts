import type { SendOrganizationEventCreatedEmailToFollowersCommand } from '@/emails/application/send-organization-event-created-email-to-followers.command'
import { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import { Event, type EventEditableData } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface Param {
  data: EventEditableData
  organizationId: string
  userId: string
}
export class CreateEventCommand extends Command<Param, void> {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly sendOrganizationEventCreatedEmailToFollowersCommand: SendOrganizationEventCreatedEmailToFollowersCommand,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizationId, data, userId } = param

    await this.userIsOrganizerEnsurer.ensure({ userId, organizationId })

    const event = Event.create(data, organizationId)

    await this.eventsRepository.save(event)

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
