import { Command } from '@/shared/application/use-case/command'
import { type EventData } from '../domain/event'
import { EventId } from '../domain/event-id'
import type { EventsRepository } from '../domain/events.repository'

interface Param {
  eventId: string
  data: EventData
}
export class UpdateEventCommand extends Command<Param, void> {
  constructor(private readonly eventsRepository: EventsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { eventId, data } = param

    const id = new EventId(eventId)
    const event = await this.eventsRepository.find(id)
    event.update(data)

    await this.eventsRepository.save(event)
  }
}
