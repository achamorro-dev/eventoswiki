import type { MatcheableRepository } from '@/modules/shared/domain/repository/matcheable-repository'
import type { EventsCriteria } from './criterias/events-criteria'
import { Event } from './event'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository.ts'

export interface EventsRepository
  extends MatcheableRepository<EventsCriteria, Event>,
    FindableByIdRepository<Event['slug'], Event> {}
