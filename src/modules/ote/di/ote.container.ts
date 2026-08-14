import { ContainerBuilder } from 'diod'
import { FindEventsQuery } from '@/events/application/find-events.query'
import { EventsContainer } from '@/events/di/events.container'
import { FindMeetupsQuery } from '@/meetups/application/find-meetups.query'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { BuildOteFeedQuery } from '../application/build-ote-feed.query'

const builder = new ContainerBuilder()

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(FindEventsQuery).useFactory(_ => EventsContainer.get(FindEventsQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(FindMeetupsQuery).useFactory(_ => MeetupsContainer.get(FindMeetupsQuery))

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(GetOrganizationByIdQuery).useFactory(_ => OrganizationsContainer.get(GetOrganizationByIdQuery))

builder
  .register(BuildOteFeedQuery)
  .use(BuildOteFeedQuery)
  .withDependencies([FindEventsQuery, FindMeetupsQuery, GetOrganizationByIdQuery])

export const OteContainer = builder.build({ autowire: false })
