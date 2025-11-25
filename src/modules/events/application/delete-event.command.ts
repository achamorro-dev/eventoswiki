import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import { EventId } from '../domain/event-id'
import type { EventsRepository } from '../domain/events.repository'

interface Param {
  eventId: string
  userId: string
}
export class DeleteEventCommand extends Command<Param, void> {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { eventId, userId } = param

    const event = await this.eventsRepository.find(EventId.of(eventId))

    const organizationId = event.organizationId
    if (organizationId) {
      await this.userIsOrganizerEnsurer.ensure({ userId, organizationId: organizationId })
    }

    await this.eventsRepository.delete(event.id)
  }
}
