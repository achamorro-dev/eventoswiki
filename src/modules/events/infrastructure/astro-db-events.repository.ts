import { and, asc, count, db, desc, Event, eq, gt, gte, isDbError, like, lt, lte, ne, or, Province } from 'astro:db'
import { EventNotFound } from '@/events/domain/errors/event-not-found.ts'
import type { Filter } from '@/shared/domain/criteria/filter'
import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'
import { FilterType } from '@/shared/domain/criteria/filter-type'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { Agenda } from '../domain/agenda/agenda'
import type { AgendaItemsRepository } from '../domain/agenda/agenda-items.repository'
import type { AgendaTracksRepository } from '../domain/agenda/agenda-tracks.repository'
import type { EventsCriteria } from '../domain/criterias/events-criteria'
import type { EventsOrder } from '../domain/criterias/events-order'
import { EventAlreadyExists } from '../domain/errors/event-already-exists.error'
import { Event as EventEntity } from '../domain/event'
import type { EventId } from '../domain/event-id'
import type { EventsRepository } from '../domain/events.repository'
import { TicketCollection } from '../domain/ticket-collection'
import type { TicketsRepository } from '../domain/tickets.repository'
import type { AstroDbEventDto } from './dtos/astro-db-event.dto'
import type { AstroDbEventProvinceDto } from './dtos/astro-db-event-province.dto'
import { AstroEventMapper as AstroDbEventMapper } from './mappers/astro-db-event.mapper'

export class AstroDbEventsRepository implements EventsRepository {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly agendaTracksRepository: AgendaTracksRepository,
    private readonly agendaItemsRepository: AgendaItemsRepository,
  ) {}
  async match(criteria: EventsCriteria): Promise<PaginatedResult<EventEntity>> {
    const eventsQuery = this.getEventsQueryWithCriteria(criteria).orderBy(...this.getOrderBy(criteria.order))
    const countQuery = this.getCountEventsQueryWithCriteria(criteria)

    if (criteria.limit) {
      eventsQuery.limit(criteria.limit)
    }

    if (criteria.page) {
      eventsQuery.offset(criteria.offset)
    }

    const events = (await eventsQuery) as { Event: AstroDbEventDto; Province: AstroDbEventProvinceDto | null }[]
    const count = await countQuery
    const totalPages = Math.ceil(count[0].count / criteria.limit)

    // Load agendas for all events
    const agendas: (Agenda | undefined)[] = await Promise.all(
      events.map(async ({ Event }) => {
        const tracks = await this.agendaTracksRepository.findByEventId(Event.id ?? '')
        const commonElements = await this.agendaItemsRepository.findByEventId(Event.id ?? '')
        return tracks.length > 0 || commonElements.length > 0 ? Agenda.create({ tracks, commonElements }) : undefined
      }),
    )

    const domainEvents = AstroDbEventMapper.toDomainList(events, agendas)

    // Load tickets for each event
    for (const event of domainEvents) {
      const ticketsData = await this.ticketsRepository.findByEventId(event.id.value)
      event.tickets = new TicketCollection(ticketsData)
    }

    return new PaginatedResult(domainEvents, totalPages, criteria.page, criteria.limit)
  }

  async find(id: EventId): Promise<EventEntity> {
    const result = await db
      .select()
      .from(Event)
      .leftJoin(Province, eq(Province.slug, Event.location))
      .where(eq(Event.id, id.value))
      .limit(1)
    if (!result.at(0)) {
      throw new EventNotFound(id.value)
    }

    const eventId = result.at(0)?.Event?.id ?? ''

    // Load agenda
    const tracks = await this.agendaTracksRepository.findByEventId(eventId)
    const commonElements = await this.agendaItemsRepository.findByEventId(eventId)
    const agenda =
      tracks.length > 0 || commonElements.length > 0 ? Agenda.create({ tracks, commonElements }) : undefined

    const event = AstroDbEventMapper.toDomain(
      result.at(0)?.Event as AstroDbEventDto,
      result.at(0)?.Province ?? null,
      agenda,
    )

    // Load tickets
    const ticketsData = await this.ticketsRepository.findByEventId(event.id.value)
    event.tickets = new TicketCollection(ticketsData)

    return event
  }

  async findBySlug(slug: string): Promise<EventEntity> {
    const result = await db
      .select()
      .from(Event)
      .leftJoin(Province, eq(Province.slug, Event.location))
      .where(eq(Event.slug, slug))
      .limit(1)
    if (!result.at(0)) {
      throw new EventNotFound(slug)
    }

    const eventId = result.at(0)?.Event?.id ?? ''

    // Load agenda
    const tracks = await this.agendaTracksRepository.findByEventId(eventId)
    const commonElements = await this.agendaItemsRepository.findByEventId(eventId)
    const agenda =
      tracks.length > 0 || commonElements.length > 0 ? Agenda.create({ tracks, commonElements }) : undefined

    const event = AstroDbEventMapper.toDomain(
      result.at(0)?.Event as AstroDbEventDto,
      result.at(0)?.Province ?? null,
      agenda,
    )

    // Load tickets
    const ticketsData = await this.ticketsRepository.findByEventId(event.id.value)
    event.tickets = new TicketCollection(ticketsData)

    return event
  }

  async findAll(): Promise<EventEntity[]> {
    const eventsAndProvinces = await db.select().from(Event).leftJoin(Province, eq(Province.slug, Event.location))

    // Load agendas for all events
    const agendas: (Agenda | undefined)[] = await Promise.all(
      eventsAndProvinces.map(async ({ Event }) => {
        const tracks = await this.agendaTracksRepository.findByEventId(Event.id ?? '')
        const commonElements = await this.agendaItemsRepository.findByEventId(Event.id ?? '')
        return tracks.length > 0 || commonElements.length > 0 ? Agenda.create({ tracks, commonElements }) : undefined
      }),
    )

    const events = AstroDbEventMapper.toDomainList(
      eventsAndProvinces as { Event: AstroDbEventDto; Province: AstroDbEventProvinceDto | null }[],
      agendas,
    )

    // Load tickets for each event
    for (const event of events) {
      const ticketsData = await this.ticketsRepository.findByEventId(event.id.value)
      event.tickets = new TicketCollection(ticketsData)
    }

    return events
  }

  async save(value: EventEntity): Promise<void> {
    const event = await db.select().from(Event).where(eq(Event.id, value.id.value))
    const hasEvent = event.length !== 0

    await (hasEvent ? this._updateEvent(value) : this._insertEvent(value))

    // Save tickets
    await this.ticketsRepository.saveByEventId(value.id.value, value.tickets.getTickets())

    // Save agenda
    if (value.agenda) {
      await this.agendaTracksRepository.saveByEventId(value.id.value, value.agenda.getTracks())
      await this.agendaItemsRepository.saveByEventId(value.id.value, value.agenda.getCommonElements())
    } else {
      // Clear agenda if it was removed
      await this.agendaTracksRepository.deleteByEventId(value.id.value)
      await this.agendaItemsRepository.deleteByEventId(value.id.value)
    }
  }

  async delete(id: EventId): Promise<void> {
    try {
      // Delete associated agenda first
      await this.agendaTracksRepository.deleteByEventId(id.value)
      await this.agendaItemsRepository.deleteByEventId(id.value)
      // Delete associated tickets
      await this.ticketsRepository.deleteByEventId(id.value)
      // Then delete the event
      await db.delete(Event).where(eq(Event.id, id.value))
    } catch (_error) {
      throw new EventNotFound(id.value)
    }
  }

  private async _updateEvent(value: EventEntity): Promise<void | PromiseLike<void>> {
    try {
      await db
        .update(Event)
        .set({
          slug: value.slug,
          title: value.title,
          shortDescription: value.shortDescription,
          startsAt: value.startsAt,
          endsAt: value.endsAt,
          image: value.image.toString(),
          type: value.type.value,
          location: value.location,
          web: value.web,
          twitter: value.twitter,
          linkedin: value.linkedin,
          youtube: value.youtube,
          twitch: value.twitch,
          facebook: value.facebook,
          instagram: value.instagram,
          github: value.github,
          telegram: value.telegram,
          whatsapp: value.whatsapp,
          discord: value.discord,
          tiktok: value.tiktok,
          streamingUrl: value.streamingUrl,
          tags: value.tags.length > 0 ? value.tags.join(',') : '',
          tagColor: value.tagColor,
          content: value.content,
          place: value.place ? value.place.toPrimitives() : null,
          callForSponsorsEnabled: value.callForSponsorsEnabled,
          callForSponsorsContent: value.callForSponsorsContent,
          callForSpeakersEnabled: value.callForSpeakersEnabled,
          callForSpeakersStartsAt: value.callForSpeakersStartsAt,
          callForSpeakersEndsAt: value.callForSpeakersEndsAt,
          callForSpeakersContent: value.callForSpeakersContent,
        })
        .where(eq(Event.id, value.id.value))
    } catch (error) {
      this._mapError(error, value)
    }
  }

  private async _insertEvent(value: EventEntity): Promise<void | PromiseLike<void>> {
    try {
      await db.insert(Event).values({
        id: value.id.value,
        slug: value.slug,
        title: value.title,
        shortDescription: value.shortDescription,
        startsAt: value.startsAt,
        endsAt: value.endsAt,
        image: value.image.toString(),
        type: value.type.value,
        location: value.location,
        web: value.web,
        twitter: value.twitter,
        linkedin: value.linkedin,
        youtube: value.youtube,
        twitch: value.twitch,
        facebook: value.facebook,
        instagram: value.instagram,
        github: value.github,
        telegram: value.telegram,
        whatsapp: value.whatsapp,
        discord: value.discord,
        tiktok: value.tiktok,
        streamingUrl: value.streamingUrl,
        tags: value.tags.length > 0 ? value.tags.join(',') : '',
        tagColor: value.tagColor,
        content: value.content,
        organizationId: value.organizationId,
        place: value.place ? value.place.toPrimitives() : null,
        callForSponsorsEnabled: value.callForSponsorsEnabled,
        callForSponsorsContent: value.callForSponsorsContent,
        callForSpeakersEnabled: value.callForSpeakersEnabled,
        callForSpeakersStartsAt: value.callForSpeakersStartsAt,
        callForSpeakersEndsAt: value.callForSpeakersEndsAt,
        callForSpeakersContent: value.callForSpeakersContent,
      })
    } catch (error) {
      this._mapError(error, value)
    }
  }

  private _mapError(error: unknown, value: EventEntity) {
    if (isDbError(error)) {
      switch (error.code) {
        case 'SQLITE_CONSTRAINT_UNIQUE':
        case 'SQLITE_CONSTRAINT_PRIMARYKEY':
          throw new EventAlreadyExists(value.slug)
        default:
          throw error
      }
    }

    throw error
  }

  private getOrderBy(order: Partial<EventsOrder> | undefined) {
    const orderBy = []

    if (order?.startsAt === OrderDirection.ASC) {
      orderBy.push(asc(Event.startsAt))
    }

    if (order?.startsAt === OrderDirection.DESC) {
      orderBy.push(desc(Event.startsAt))
    }

    if (order?.endsAt === OrderDirection.ASC) {
      orderBy.push(asc(Event.endsAt))
    }

    if (order?.endsAt === OrderDirection.DESC) {
      orderBy.push(desc(Event.endsAt))
    }

    return orderBy
  }

  private getEventsQueryWithCriteria(criteria: EventsCriteria) {
    return (
      db
        .select()
        .from(Event)
        .leftJoin(Province, eq(Province.slug, Event.location))
        //@ts-expect-error
        .where(...this.getEventsFiltersByCriteria(criteria))
    )
  }

  private getCountEventsQueryWithCriteria(criteria: EventsCriteria) {
    return (
      db
        .select({ count: count() })
        .from(Event)
        .leftJoin(Province, eq(Province.slug, Event.location))
        //@ts-expect-error
        .where(...this.getEventsFiltersByCriteria(criteria))
    )
  }

  private getEventsFiltersByCriteria(criteria: EventsCriteria) {
    return this.getFiltersToApply(criteria.filters)
  }

  //@ts-expect-error return any, pending fix types
  private getFiltersToApply<F>(parentFilters: F | Array<Filter<F>>) {
    if (!parentFilters) return []

    if (Array.isArray(parentFilters)) {
      return parentFilters.map((parentFilter: Filter<F>) => {
        const { type, filters } = parentFilter
        //@ts-expect-error
        const criterias = this.getFiltersToApply(filters)
        return type === FilterType.AND ? and(...criterias) : or(...criterias)
      })
    }

    return (
      Object.entries<FilterCriteria | undefined>(parentFilters as Record<string, FilterCriteria>)
        .filter(([_, value]) => value !== undefined)
        // biome-ignore lint/suspicious/useIterableCallbackReturn: Known issue with types
        .map(([key, eventFilter]) => {
          if (!eventFilter) return

          switch (eventFilter.operator) {
            case RelationalOperator.EQUALS:
              //@ts-expect-error
              return eq(Event[key], eventFilter.value)
            case RelationalOperator.GREATER_THAN_OR_EQUAL:
              //@ts-expect-error
              return gte(Event[key], eventFilter.value)
            case RelationalOperator.LOWER_THAN_OR_EQUAL:
              //@ts-expect-error
              return lte(Event[key], eventFilter.value)
            case RelationalOperator.GREATER_THAN:
              //@ts-expect-error
              return gt(Event[key], eventFilter.value)
            case RelationalOperator.LOWER_THAN:
              //@ts-expect-error
              return lt(Event[key], eventFilter.value)
            case RelationalOperator.LIKE:
            case RelationalOperator.LIKE_NOT_SENSITIVE:
              //@ts-expect-error
              return like(Event[key], eventFilter.value)
            case RelationalOperator.NOT_EQUALS:
              //@ts-expect-error
              return ne(Event[key], eventFilter.value)
          }
        })
    )
  }
}
