export interface SearchItemDto {
  id: string
  title: string
  url: string
  subtitle: string | null
}

export interface GlobalSearchResultsDto {
  events: { upcoming: SearchItemDto[]; past: SearchItemDto[] }
  meetups: { upcoming: SearchItemDto[]; past: SearchItemDto[] }
  organizations: SearchItemDto[]
  provinces: SearchItemDto[]
}

export const isEmptyGlobalSearchResults = (results: GlobalSearchResultsDto): boolean =>
  results.events.upcoming.length === 0 &&
  results.events.past.length === 0 &&
  results.meetups.upcoming.length === 0 &&
  results.meetups.past.length === 0 &&
  results.organizations.length === 0 &&
  results.provinces.length === 0
