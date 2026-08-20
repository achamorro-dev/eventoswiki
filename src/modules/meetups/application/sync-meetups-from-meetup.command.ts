import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import type { GetProvincesQuery } from '@/provinces/application/get-provinces.query'
import { ProvinceCollection } from '@/provinces/domain/province-collection'
import { Command } from '@/shared/application/use-case/command'
import { SlugGenerator } from '@/shared/presentation/services/slugs/slug-generator'
import { OrganizationMeetupUrlMissing } from '../domain/errors/organization-meetup-url-missing.error'
import type { ExternalMeetupEvent, ExternalMeetupsProvider } from '../domain/external-meetups-provider'
import { Meetup, type MeetupEditableData } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

const LEGACY_PLACEHOLDER_IMAGE = 'https://eventos.wiki/og.jpg'
const DEFAULT_EVENT_DURATION_MS = 2 * 60 * 60 * 1000
const SHORT_DESCRIPTION_MAX_LENGTH = 160

interface Param {
  organizationId: string
  userId: string
  externalIds?: string[]
}

export interface SyncMeetupsResult {
  created: number
  updated: number
}

export class SyncMeetupsFromMeetupCommand extends Command<Param, SyncMeetupsResult> {
  private provinces: ProvinceCollection = new ProvinceCollection([])
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
    private readonly externalMeetupsProvider: ExternalMeetupsProvider,
    private readonly getProvincesQuery: GetProvincesQuery,
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

    const [externalEvents, meetupsByExternalId, provinces] = await Promise.all([
      this.externalMeetupsProvider.getEvents(organization.meetup),
      this._getMeetupsByExternalId(organizationId),
      this.getProvincesQuery.execute(),
    ])
    this.provinces = new ProvinceCollection(provinces)

    const eventsToSync = this._filterEventsToSync(externalEvents, param.externalIds)
    const result: SyncMeetupsResult = { created: 0, updated: 0 }

    for (const externalEvent of eventsToSync) {
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

  private _filterEventsToSync(externalEvents: ExternalMeetupEvent[], externalIds?: string[]): ExternalMeetupEvent[] {
    if (!externalIds) {
      return externalEvents
    }

    const externalIdsToSync = new Set(externalIds)

    return externalEvents.filter(externalEvent => externalIdsToSync.has(externalEvent.externalId))
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
      image: this._toImage(externalEvent, existingMeetup),
      type: externalEvent.type,
      location: this._toLocation(externalEvent, existingMeetup),
      web: externalEvent.eventUrl,
      tags: existingMeetup?.tags ?? externalEvent.tags,
      allowsAttendees: existingMeetup?.allowsAttendees ?? false,
      externalId: externalEvent.externalId,
    }
  }

  private _toImage(externalEvent: ExternalMeetupEvent, existingMeetup?: Meetup): string | null {
    if (externalEvent.imageUrl) {
      return externalEvent.imageUrl
    }

    const existingImage = existingMeetup?.image?.toString()
    if (!existingImage || existingImage === LEGACY_PLACEHOLDER_IMAGE) {
      return null
    }

    return existingImage
  }

  private _toLocation(externalEvent: ExternalMeetupEvent, existingMeetup?: Meetup): string | null {
    const venueProvinceSlug = this.provinces.slugWithCity(externalEvent.venueCity)
    if (venueProvinceSlug) return venueProvinceSlug

    return this.provinces.slugWithName(existingMeetup?.location ?? undefined) ?? null
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
