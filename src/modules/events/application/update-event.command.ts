import { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import { type EventEditableData } from '../domain/event'
import { EventId } from '../domain/event-id'
import type { EventsRepository } from '../domain/events.repository'

interface Param {
  eventId: string
  data: EventEditableData
  userId: string
}
export class UpdateEventCommand extends Command<Param, void> {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { eventId, data, userId } = param

    const id = new EventId(eventId)
    const event = await this.eventsRepository.find(id)

    const organizationId = event.organizationId
    if (organizationId) {
      await this.userIsOrganizerEnsurer.ensure({ userId, organizationId: organizationId })
    }

    event.update(data)
    await this.eventsRepository.save(event)
  }
}
