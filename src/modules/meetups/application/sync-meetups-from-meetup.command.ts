import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import { SlugGenerator } from '@/shared/presentation/services/slugs/slug-generator'
import { OrganizationMeetupUrlMissing } from '../domain/errors/organization-meetup-url-missing.error'
import type { ExternalMeetupEvent, ExternalMeetupsProvider } from '../domain/external-meetups-provider'
import { Meetup, type MeetupEditableData } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

const DEFAULT_MEETUP_IMAGE = 'https://eventos.wiki/og.jpg'
const DEFAULT_EVENT_DURATION_MS = 2 * 60 * 60 * 1000
const SHORT_DESCRIPTION_MAX_LENGTH = 160

interface Param {
  organizationId: string
  userId: string
}

export interface SyncMeetupsResult {
  created: number
  updated: number
}

export class SyncMeetupsFromMeetupCommand extends Command<Param, SyncMeetupsResult> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
    private readonly externalMeetupsProvider: ExternalMeetupsProvider,
  ) {
    super()
  }

  async execute(param: Param): Promise<SyncMeetupsResult> {
    const { organizationId, userId } = param

    await this.userIsOrganizerEnsurer.ensure({ userId, organizationId })

    const organization = await this.getOrganizationByIdQuery.execute({ id: organizationId })
    if (!organization.meetup) {
      throw new OrganizationMeetupUrlMissing(organizationId)
    }

    const externalEvents = await this.externalMeetupsProvider.getEvents(organization.meetup)
    const meetupsByExternalId = await this._getMeetupsByExternalId(organizationId)

    const result: SyncMeetupsResult = { created: 0, updated: 0 }

    for (const externalEvent of externalEvents) {
      const existingMeetup = meetupsByExternalId.get(externalEvent.externalId)

      if (existingMeetup) {
        existingMeetup.update(this._toMeetupData(externalEvent, existingMeetup))
        await this.meetupsRepository.save(existingMeetup)
        result.updated++
        continue
      }

      const meetup = Meetup.create(this._toMeetupData(externalEvent), organizationId)
      await this.meetupsRepository.save(meetup)
      result.created++
    }

    return result
  }

  private async _getMeetupsByExternalId(organizationId: string): Promise<Map<string, Meetup>> {
    const organizationMeetups = await this.meetupsRepository.findByOrganizationId(organizationId)

    return new Map(
      organizationMeetups.filter(meetup => meetup.externalId).map(meetup => [meetup.externalId as string, meetup]),
    )
  }

  private _toMeetupData(externalEvent: ExternalMeetupEvent, existingMeetup?: Meetup): MeetupEditableData {
    return {
      title: externalEvent.title,
      slug: existingMeetup?.slug ?? this._generateSlug(externalEvent),
      shortDescription: this._toShortDescription(externalEvent),
      content: this._toContent(externalEvent),
      startsAt: externalEvent.startsAt,
      endsAt: this._endsAt(externalEvent),
      image: externalEvent.imageUrl ?? DEFAULT_MEETUP_IMAGE,
      type: externalEvent.type,
      location: null,
      web: externalEvent.eventUrl,
      tags: existingMeetup?.tags ?? [],
      tagColor: existingMeetup?.tagColor ?? '',
      allowsAttendees: existingMeetup?.allowsAttendees ?? false,
      externalId: externalEvent.externalId,
    }
  }

  private _toContent(externalEvent: ExternalMeetupEvent): string {
    const description = externalEvent.description || `Más información en ${externalEvent.eventUrl}`
    const venue = [externalEvent.venueName, externalEvent.venueAddress, externalEvent.venueCity]
      .filter(Boolean)
      .join(', ')

    return venue ? `${description}\n\n**Ubicación:** ${venue}` : description
  }

  private _generateSlug(externalEvent: ExternalMeetupEvent): string {
    const year = new Date(externalEvent.startsAt).getFullYear()
    const titleSlug = new SlugGenerator(externalEvent.title).generate()

    return `${year}/${titleSlug}-${externalEvent.externalId}`
  }

  private _toShortDescription(externalEvent: ExternalMeetupEvent): string {
    const description = externalEvent.description?.replace(/\s+/g, ' ').trim()

    if (!description) {
      return externalEvent.title
    }

    return description.length > SHORT_DESCRIPTION_MAX_LENGTH
      ? `${description.slice(0, SHORT_DESCRIPTION_MAX_LENGTH - 1)}…`
      : description
  }

  private _endsAt(externalEvent: ExternalMeetupEvent): string {
    if (externalEvent.endsAt) {
      return externalEvent.endsAt
    }

    const startsAt = new Date(externalEvent.startsAt)
    return new Date(startsAt.getTime() + DEFAULT_EVENT_DURATION_MS).toISOString()
  }
}
