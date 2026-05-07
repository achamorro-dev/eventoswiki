import type { SendOrganizationEventUpdatedEmailCommand } from '@/emails/application/send-organization-event-updated-email.command'
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

function hasCriticalFieldChanged(event: EventLike, data: EventEditableData): boolean {
  if (data.title !== undefined && data.title !== event.title) return true

  if (data.startsAt !== undefined) {
    if (new Date(event.startsAt).getTime() !== new Date(data.startsAt).getTime()) return true
  }

  if (data.endsAt !== undefined) {
    if (new Date(event.endsAt).getTime() !== new Date(data.endsAt).getTime()) return true
  }

  if (data.type !== undefined && data.type !== event.type.value) return true

  if (data.location !== undefined && (data.location ?? null) !== (event.location ?? null)) return true

  if (data.streamingUrl !== undefined && data.streamingUrl !== (event.streamingUrl ?? undefined)) return true

  if (data.place !== undefined) {
    const currentPlace = event.place?.value
    if (!currentPlace && !data.place) return false
    if (!currentPlace || !data.place) return true
    if (
      currentPlace.id !== data.place.id ||
      currentPlace.name !== data.place.name ||
      currentPlace.address !== data.place.address
    )
      return true
  }

  return false
}

interface EventLike {
  title: string
  startsAt: Date
  endsAt: Date
  type: { value: string }
  location: string | null
  streamingUrl?: string
  place?: { value: { id: string; name: string; address: string } }
}

export class UpdateEventCommand extends Command<Param, void> {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly sendOrganizationEventUpdatedEmailCommand: SendOrganizationEventUpdatedEmailCommand,
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

    const criticalFieldsChanged = hasCriticalFieldChanged(event, data)

    event.update(data)
    await this.eventsRepository.save(event)

    if (criticalFieldsChanged && organizationId) {
      this.sendOrganizationEventUpdatedEmailCommand
        .execute({
          eventId: event.id.value,
          organizationId,
        })
        .catch(error => {
          console.error('[UpdateEventCommand] Error sending email notification:', error)
        })
    }
  }
}
