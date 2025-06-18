import type { GetUserOrganizationsQuery } from '@/organizations/application/get-user-organizations.query'
import { Command } from '@/shared/application/use-case/command'
import { EventNotFound } from '../domain/errors/event-not-found'
import { EventId } from '../domain/event-id'
import type { EventsRepository } from '../domain/events.repository'

interface Param {
  eventId: string
  userId: string
}
export class DeleteEventCommand extends Command<Param, void> {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly getUserOrganizationsQuery: GetUserOrganizationsQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { eventId, userId } = param

    const [event, organizations] = await Promise.all([
      this.eventsRepository.find(EventId.of(eventId)),
      this.getUserOrganizationsQuery.execute({ userId }),
    ])

    const userNotOrganizeTheEvent = !organizations.some(organization => event.isOrganizedBy(organization.id))
    if (userNotOrganizeTheEvent) {
      throw new EventNotFound(eventId)
    }

    await this.eventsRepository.delete(event.id)
  }
}
