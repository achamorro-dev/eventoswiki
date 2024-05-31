import type { MatcheableRepository } from '@/modules/shared/domain/repository/matcheable-repository'
import type { EventsCriteria } from './criterias/events-criteria'
import { Event } from './event'

export interface EventsRepository extends MatcheableRepository<EventsCriteria, Event> {}
