import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Query } from '@/shared/application/use-case/query'
import { OrganizationExternalMeetupsUrlMissing } from '../domain/errors/organization-external-meetups-url-missing.error'
import type { ExternalMeetupsSource } from '../domain/external-meetups-source'
import type { MeetupsRepository } from '../domain/meetups.repository'
import type { ExternalMeetupsProviders } from './external-meetups-providers'

interface Param {
  organizationId: string
  userId: string
  source: ExternalMeetupsSource
}

export interface ExternalMeetupPreview {
  externalId: string
  title: string
  startsAt: string
  imageUrl: string | null
  eventUrl: string
  isImported: boolean
}

export class GetExternalMeetupsQuery extends Query<ExternalMeetupPreview[], Param> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
    private readonly externalMeetupsProviders: ExternalMeetupsProviders,
  ) {
    super()
  }

  async execute({ organizationId, userId, source }: Param): Promise<ExternalMeetupPreview[]> {
    await this.userIsOrganizerEnsurer.ensure({ userId, organizationId })

    const organization = await this.getOrganizationByIdQuery.execute({ id: organizationId })
    const groupUrl = organization[source]
    if (!groupUrl) {
      throw new OrganizationExternalMeetupsUrlMissing(organizationId, source)
    }

    const [externalEvents, organizationMeetups] = await Promise.all([
      this.externalMeetupsProviders.get(source).getEventSummaries(groupUrl),
      this.meetupsRepository.findByOrganizationId(organizationId),
    ])

    const importedExternalIds = new Set(
      organizationMeetups.filter(meetup => meetup.externalId).map(meetup => meetup.externalId as string),
    )

    return externalEvents
      .map(externalEvent => ({
        externalId: externalEvent.externalId,
        title: externalEvent.title,
        startsAt: externalEvent.startsAt,
        imageUrl: externalEvent.imageUrl,
        eventUrl: externalEvent.eventUrl,
        isImported: importedExternalIds.has(externalEvent.externalId),
      }))
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
  }
}
