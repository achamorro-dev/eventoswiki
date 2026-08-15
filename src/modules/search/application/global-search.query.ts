import type { SearchEventsQuery } from '@/events/application/search-events.query'
import type { Event } from '@/events/domain/event'
import type { SearchMeetupsQuery } from '@/meetups/application/search-meetups.query'
import type { Meetup } from '@/meetups/domain/meetup'
import type { SearchOrganizationsQuery } from '@/organizations/application/search-organizations.query'
import type { Organization } from '@/organizations/domain/organization'
import type { GetProvincesQuery } from '@/provinces/application/get-provinces.query'
import type { Province } from '@/provinces/domain/province'
import { Query } from '@/shared/application/use-case/query'

interface GlobalSearchRequest {
  query: string
  limit?: number
}

export interface GlobalSearchResult {
  events: { upcoming: Event[]; past: Event[] }
  meetups: { upcoming: Meetup[]; past: Meetup[] }
  organizations: Organization[]
  provinces: Province[]
}

const DEFAULT_RESULTS_LIMIT = 5
const MIN_SEARCH_LENGTH = 2

const removeDiacritics = (value: string): string => value.normalize('NFD').replace(/\p{Diacritic}/gu, '')

export class GlobalSearchQuery extends Query<GlobalSearchResult, GlobalSearchRequest> {
  constructor(
    private readonly searchEventsQuery: SearchEventsQuery,
    private readonly searchMeetupsQuery: SearchMeetupsQuery,
    private readonly searchOrganizationsQuery: SearchOrganizationsQuery,
    private readonly getProvincesQuery: GetProvincesQuery,
  ) {
    super()
  }

  async execute({ query, limit = DEFAULT_RESULTS_LIMIT }: GlobalSearchRequest): Promise<GlobalSearchResult> {
    const isSearchMode = query.trim().length >= MIN_SEARCH_LENGTH

    const [events, meetups, organizations, provinces] = await Promise.all([
      this.searchEventsQuery.execute({ query, limit }),
      this.searchMeetupsQuery.execute({ query, limit }),
      this.searchOrganizationsQuery.execute({ query, limit }),
      this.getProvincesQuery.execute(),
    ])

    return {
      events: { upcoming: events.upcoming, past: isSearchMode ? events.past : [] },
      meetups: { upcoming: meetups.upcoming, past: isSearchMode ? meetups.past : [] },
      organizations: organizations.data,
      provinces: isSearchMode ? this.filterProvinces(provinces, query, limit) : [],
    }
  }

  private filterProvinces(provinces: Province[], query: string, limit: number): Province[] {
    const normalizedQuery = removeDiacritics(query).trim().toLowerCase()
    if (!normalizedQuery) return []

    return provinces
      .filter(province => removeDiacritics(province.name).toLowerCase().includes(normalizedQuery))
      .slice(0, limit)
  }
}
