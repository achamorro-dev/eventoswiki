import { Query } from '@/shared/application/use-case/query'
import { NextMeetupsCriteria } from '../domain/criterias/next-meetups-criteria'
import { PastMeetupsCriteria } from '../domain/criterias/past-meetups-criteria'
import type { Meetup } from '../domain/meetup'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface SearchMeetupsRequest {
  query: string
  limit?: number
}

export interface MeetupsSearchResult {
  upcoming: Meetup[]
  past: Meetup[]
}

const DEFAULT_RESULTS_LIMIT = 5

export class SearchMeetupsQuery extends Query<MeetupsSearchResult, SearchMeetupsRequest> {
  constructor(private readonly meetupsRepository: MeetupsRepository) {
    super()
  }

  async execute(request: SearchMeetupsRequest): Promise<MeetupsSearchResult> {
    const { query, limit = DEFAULT_RESULTS_LIMIT } = request

    const [upcoming, past] = await Promise.all([
      this.meetupsRepository.match(NextMeetupsCriteria.createWith({}).withTitleLike(query).withLimit(limit)),
      this.meetupsRepository.match(PastMeetupsCriteria.createWith({}).withTitleLike(query).withLimit(limit)),
    ])

    return { upcoming: upcoming.data, past: past.data }
  }
}
