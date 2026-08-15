import { ContainerBuilder } from 'diod'
import { SearchEventsQuery } from '@/events/application/search-events.query'
import { EventsContainer } from '@/events/di/events.container'
import { SearchMeetupsQuery } from '@/meetups/application/search-meetups.query'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { SearchOrganizationsQuery } from '@/organizations/application/search-organizations.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { GetProvincesQuery } from '@/provinces/application/get-provinces.query'
import { ProvincesContainer } from '@/provinces/di/provinces.container'
import { GlobalSearchQuery } from '../application/global-search.query'

const builder = new ContainerBuilder()

// biome-ignore lint/correctness/useHookAtTopLevel: useFactory is a diod builder method, not a React hook
builder.register(SearchEventsQuery).useFactory(() => EventsContainer.get(SearchEventsQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: useFactory is a diod builder method, not a React hook
builder.register(SearchMeetupsQuery).useFactory(() => MeetupsContainer.get(SearchMeetupsQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: useFactory is a diod builder method, not a React hook
builder.register(SearchOrganizationsQuery).useFactory(() => OrganizationsContainer.get(SearchOrganizationsQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: useFactory is a diod builder method, not a React hook
builder.register(GetProvincesQuery).useFactory(() => ProvincesContainer.get(GetProvincesQuery))

builder
  .register(GlobalSearchQuery)
  .use(GlobalSearchQuery)
  .withDependencies([SearchEventsQuery, SearchMeetupsQuery, SearchOrganizationsQuery, GetProvincesQuery])

export const SearchContainer = builder.build({ autowire: false })
