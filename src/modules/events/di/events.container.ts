import { ContainerBuilder } from 'diod'
import { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { CreateEventCommand } from '../application/create-event.command'
import { DeleteEventCommand } from '../application/delete-event.command'
import { FindEventQuery } from '../application/find-event.query'
import { FindEventsQuery } from '../application/find-events.query'
import { GetEventQuery } from '../application/get-event.query'
import { GetEventsQuery } from '../application/get-events.query'
import { GetNextEventsQuery } from '../application/get-next-events.query'
import { GetPastEventsQuery } from '../application/get-past-events.query'
import { UpdateEventCommand } from '../application/update-event.command'
import { AstroDbEventsRepository } from '../infrastructure/astro-db-events.repository'
import { AstroDBTicketsRepository } from '../infrastructure/repositories/astro-db-tickets.repository'

const builder = new ContainerBuilder()

builder.register(AstroDBTicketsRepository).use(AstroDBTicketsRepository)

builder.register(AstroDbEventsRepository).use(AstroDbEventsRepository).withDependencies([AstroDBTicketsRepository])

builder.register(GetEventQuery).use(GetEventQuery).withDependencies([AstroDbEventsRepository])

builder.register(GetEventsQuery).use(GetEventsQuery).withDependencies([AstroDbEventsRepository])

builder.register(GetNextEventsQuery).use(GetNextEventsQuery).withDependencies([AstroDbEventsRepository])

builder.register(GetPastEventsQuery).use(GetPastEventsQuery).withDependencies([AstroDbEventsRepository])

builder.register(FindEventQuery).use(FindEventQuery).withDependencies([AstroDbEventsRepository])

builder.register(FindEventsQuery).use(FindEventsQuery).withDependencies([AstroDbEventsRepository])

// biome-ignore lint/correctness/useHookAtTopLevel: It's not a hook
builder.register(UserIsOrganizerEnsurer).useFactory(_ => OrganizationsContainer.get(UserIsOrganizerEnsurer))

builder
  .register(CreateEventCommand)
  .use(CreateEventCommand)
  .withDependencies([AstroDbEventsRepository, UserIsOrganizerEnsurer])

builder
  .register(UpdateEventCommand)
  .use(UpdateEventCommand)
  .withDependencies([AstroDbEventsRepository, UserIsOrganizerEnsurer])

builder
  .register(DeleteEventCommand)
  .use(DeleteEventCommand)
  .withDependencies([AstroDbEventsRepository, UserIsOrganizerEnsurer])

export const EventsContainer = builder.build({ autowire: false })
