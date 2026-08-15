import { Query } from '@/shared/application/use-case/query'
import { NextEventsCriteria } from '../domain/criterias/next-events-criteria'
import { PastEventsCriteria } from '../domain/criterias/past-events-criteria'
import type { Event } from '../domain/event'
import type { EventsRepository } from '../domain/events.repository'

interface SearchEventsRequest {
  query: string
  limit?: number
}

export interface EventsSearchResult {
  upcoming: Event[]
  past: Event[]
}

const DEFAULT_RESULTS_LIMIT = 5

export class SearchEventsQuery extends Query<EventsSearchResult, SearchEventsRequest> {
  constructor(private readonly eventsRepository: EventsRepository) {
    super()
  }

  async execute(request: SearchEventsRequest): Promise<EventsSearchResult> {
    const { query, limit = DEFAULT_RESULTS_LIMIT } = request

    const [upcoming, past] = await Promise.all([
      this.eventsRepository.match(NextEventsCriteria.createWith({}).withTitleLike(query).withLimit(limit)),
      this.eventsRepository.match(PastEventsCriteria.createWith({}).withTitleLike(query).withLimit(limit)),
    ])

    return { upcoming: upcoming.data, past: past.data }
  }
}
