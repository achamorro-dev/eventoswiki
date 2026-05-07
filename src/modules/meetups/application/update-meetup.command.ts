import type { SendOrganizationMeetupUpdatedEmailCommand } from '@/emails/application/send-organization-meetup-updated-email.command'
import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import { type MeetupEditableData } from '../domain/meetup'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  data: MeetupEditableData
  userId: string
}

interface MeetupLike {
  title: string
  startsAt: Date
  endsAt: Date
  type: { value: string }
  location: string | null
  streamingUrl?: string
  place?: { value: { id: string; name: string; address: string } }
  maxAttendees?: number
  registrationEndsAt?: Date
}

function hasCriticalFieldChanged(meetup: MeetupLike, data: MeetupEditableData): boolean {
  if (data.title !== undefined && data.title !== meetup.title) return true

  if (data.startsAt !== undefined) {
    if (new Date(meetup.startsAt).getTime() !== new Date(data.startsAt).getTime()) return true
  }

  if (data.endsAt !== undefined) {
    if (new Date(meetup.endsAt).getTime() !== new Date(data.endsAt).getTime()) return true
  }

  if (data.type !== undefined && data.type !== meetup.type.value) return true

  if (data.location !== undefined && (data.location ?? null) !== (meetup.location ?? null)) return true

  if (data.streamingUrl !== undefined && data.streamingUrl !== (meetup.streamingUrl ?? undefined)) return true

  if (data.maxAttendees !== undefined && data.maxAttendees !== meetup.maxAttendees) return true

  if (data.registrationEndsAt !== undefined) {
    const currentTs = meetup.registrationEndsAt ? new Date(meetup.registrationEndsAt).getTime() : undefined
    const newTs = data.registrationEndsAt ? new Date(data.registrationEndsAt).getTime() : undefined
    if (currentTs !== newTs) return true
  }

  if (data.place !== undefined) {
    const currentPlace = meetup.place?.value
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

export class UpdateMeetupCommand extends Command<Param, void> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly sendOrganizationMeetupUpdatedEmailCommand: SendOrganizationMeetupUpdatedEmailCommand,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { meetupId, data, userId } = param

    const id = new MeetupId(meetupId)
    const meetup = await this.meetupsRepository.find(id)

    const organizationId = meetup.organizationId
    if (organizationId) {
      await this.userIsOrganizerEnsurer.ensure({ userId, organizationId: organizationId })
    }

    const criticalFieldsChanged = hasCriticalFieldChanged(meetup, data)

    meetup.update(data)
    await this.meetupsRepository.save(meetup)

    if (criticalFieldsChanged && organizationId) {
      this.sendOrganizationMeetupUpdatedEmailCommand
        .execute({
          meetupId: meetup.id.value,
          organizationId,
        })
        .catch(error => {
          console.error('[UpdateMeetupCommand] Error sending email notification:', error)
        })
    }
  }
}
