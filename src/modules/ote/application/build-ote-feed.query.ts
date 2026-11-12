import { FindEventsQuery } from '@/events/application/find-events.query'
import type { Event } from '@/events/domain/event'
import { FindMeetupsQuery } from '@/meetups/application/find-meetups.query'
import type { Meetup } from '@/meetups/domain/meetup'
import { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { Organization } from '@/organizations/domain/organization'
import { Query } from '@/shared/application/use-case/query'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { OTE_LICENSE, OTE_SPEC_VERSION, type OteCoverage, type OteFeed } from '../domain/ote-event'
import { toOteEvent, toOteOrganizer } from '../domain/ote-event.mapper'

/**
 * La spec no pagina ni lo hará: un feed es una vista actual, no un archivo. Se
 * publica lo próximo más este margen de pasado, y `covers` lo declara para que
 * los consumidores no interpreten lo podado como eventos retirados.
 */
const PAST_COVERAGE_MONTHS = 3

/**
 * `covers.from` es un día de calendario que se compara con el `startDate` local de
 * cada evento, pero la base de datos filtra por instantes. Pedir un día más evita
 * que la diferencia horaria deje fuera un evento de la ventana; lo que sobra cae
 * fuera de ella, donde el feed no afirma nada.
 */
const TIMEZONE_MARGIN_DAYS = 1

/** Si una colección llega a esta cota, el feed ya no puede declararse completo */
const MAX_ITEMS_PER_COLLECTION = 2000
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
    const coverageFrom = pastCoverageStartDate()
    const startsAt = Datetime.subtract(Datetime.toDate(coverageFrom), TIMEZONE_MARGIN_DAYS, 'day')

    const [events, meetups] = await Promise.all([
      this.findEventsQuery.execute({ organizationId, startsAt, limit: MAX_ITEMS_PER_COLLECTION }),
      this.findMeetupsQuery.execute({ organizationId, startsAt, limit: MAX_ITEMS_PER_COLLECTION }),
    ])

    const isTruncated = [events, meetups].some(result => result.data.length >= MAX_ITEMS_PER_COLLECTION)
    const covers: OteCoverage | undefined = isTruncated ? undefined : { from: coverageFrom }

    const items: Array<Event | Meetup> = [...events.data, ...meetups.data].sort(
      (a, b) => b.startsAt.getTime() - a.startsAt.getTime(),
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
      ...(covers ? { covers } : {}),
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

function pastCoverageStartDate(): string {
  return Datetime.toDateIsoString(Datetime.subtract(Datetime.now(), PAST_COVERAGE_MONTHS, 'month'))
}
