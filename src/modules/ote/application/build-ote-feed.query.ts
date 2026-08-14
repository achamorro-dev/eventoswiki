import { FindEventsQuery } from '@/events/application/find-events.query'
import type { Event } from '@/events/domain/event'
import { FindMeetupsQuery } from '@/meetups/application/find-meetups.query'
import type { Meetup } from '@/meetups/domain/meetup'
import { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { Organization } from '@/organizations/domain/organization'
import { Query } from '@/shared/application/use-case/query'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { OTE_LICENSE, OTE_SPEC_VERSION, type OteFeed } from '../domain/ote-event'
import { toOteEvent, toOteOrganizer } from '../domain/ote-event.mapper'

/** Ventana de pasado que se publica, para que el feed no crezca sin límite */
const PAST_WINDOW_MONTHS = 12
const MAX_ITEMS_PER_COLLECTION = 500
const TEXT_LANGUAGE = 'es'

interface BuildOteFeedRequest {
  title: string
  url: string
  description?: string
  /** Presente en los feeds de una comunidad concreta; ausente en el feed global */
  organizationId?: string
}

export class BuildOteFeedQuery extends Query<OteFeed, BuildOteFeedRequest> {
  constructor(
    private readonly findEventsQuery: FindEventsQuery,
    private readonly findMeetupsQuery: FindMeetupsQuery,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
  ) {
    super()
  }

  async execute({ title, url, description, organizationId }: BuildOteFeedRequest): Promise<OteFeed> {
    const startsAt = Datetime.subtract(Datetime.now(), PAST_WINDOW_MONTHS, 'month')

    const [events, meetups] = await Promise.all([
      this.findEventsQuery.execute({ organizationId, startsAt, limit: MAX_ITEMS_PER_COLLECTION }),
      this.findMeetupsQuery.execute({ organizationId, startsAt, limit: MAX_ITEMS_PER_COLLECTION }),
    ])

    const items: Array<Event | Meetup> = [...events.data, ...meetups.data].sort(
      (a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
    )

    const organizations = await this.resolveOrganizations(items, organizationId)
    const feedOrganization = organizationId ? organizations.get(organizationId) : undefined

    return {
      specVersion: OTE_SPEC_VERSION,
      license: OTE_LICENSE,
      title,
      url,
      ...(description ? { description } : {}),
      textLanguage: TEXT_LANGUAGE,
      // El feed global es un agregador de muchas comunidades: la spec pide que
      // no declare organizadores propios y que cada evento traiga el suyo.
      ...(feedOrganization ? { organizers: [toOteOrganizer(feedOrganization)] } : {}),
      updatedAt: Datetime.toInstantString(Datetime.now()),
      events: items.map(item =>
        // En un feed de comunidad los eventos heredan el organizador del feed.
        toOteEvent(item, feedOrganization ? undefined : organizations.get(item.organizationId ?? '')),
      ),
    }
  }

  private async resolveOrganizations(
    items: Array<Event | Meetup>,
    organizationId?: string,
  ): Promise<Map<string, Organization>> {
    const ids = new Set(items.map(item => item.organizationId).filter((id): id is string => Boolean(id)))
    if (organizationId) ids.add(organizationId)

    const organizations = new Map<string, Organization>()

    await Promise.all(
      [...ids].map(async id => {
        try {
          organizations.set(id, await this.getOrganizationByIdQuery.execute({ id }))
        } catch {
          // Una organización borrada no debe tumbar el feed entero: el evento
          // simplemente sale sin organizador.
        }
      }),
    )

    return organizations
  }
}
