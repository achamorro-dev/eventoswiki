import type { MatcheableRepository } from '@/modules/shared/domain/repository/matcheable-repository'
import type { DeletableByIdRepository } from '@/shared/domain/repository/deletable-by-id-repository'
import type { FindableAllRepository } from '@/shared/domain/repository/findable-all-repository'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository.ts'
import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { EventsCriteria } from './criterias/events-criteria'
import type { EventsFilters } from './criterias/events-filters'
import type { EventsOrder } from './criterias/events-order'
import { Event } from './event'
import type { EventId } from './event-id'

export interface EventsRepository
  extends MatcheableRepository<Partial<EventsFilters>, Partial<EventsOrder>, EventsCriteria, Event>,
    FindableAllRepository<Event>,
    FindableByIdRepository<EventId, Event>,
    SaveableRepository<Event>,
    DeletableByIdRepository<EventId> {
  findBySlug(slug: string): Promise<Event>
}
