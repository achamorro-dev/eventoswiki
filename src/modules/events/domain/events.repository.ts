import type { MatcheableRepository } from '@/modules/shared/domain/repository/matcheable-repository'
import type { FindableAllRepository } from '@/shared/domain/repository/findable-all-repository'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository.ts'
import type { EventsCriteria } from './criterias/events-criteria'
import type { EventsFilters } from './criterias/events-filters'
import type { EventsOrder } from './criterias/events-order'
import { Event } from './event'

export interface EventsRepository
  extends MatcheableRepository<Partial<EventsFilters>, Partial<EventsOrder>, EventsCriteria, Event>,
    FindableAllRepository<Event>,
    FindableByIdRepository<Event['slug'], Event> {}
