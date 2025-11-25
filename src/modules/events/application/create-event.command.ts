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
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizationId, data, userId } = param

    await this.userIsOrganizerEnsurer.ensure({ userId, organizationId })

    const event = Event.create(data, organizationId)

    await this.eventsRepository.save(event)
  }
}
