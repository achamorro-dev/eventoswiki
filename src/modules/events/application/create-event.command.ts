import { Command } from '@/shared/application/use-case/command'
import { Event, type EventData } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface Param {
  data: EventData
  organizationId: string
}
export class CreateEventCommand extends Command<Param, void> {
  constructor(private readonly eventsRepository: EventsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizationId, data } = param

    const event = Event.create(data, organizationId)

    await this.eventsRepository.save(event)
  }
}
