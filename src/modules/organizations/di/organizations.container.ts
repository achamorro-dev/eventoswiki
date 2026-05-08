import { ContainerBuilder } from 'diod'
import { CheckUserIsAdminQuery } from '@/users/application/check-user-is-admin.query'
import { GetUserQuery } from '@/users/application/get-user.query'
import { UsersContainer } from '@/users/di/users.container'
import { AddOrganizerCommand } from '../application/add-organizer.command'
import { CreateOrganizationCommand } from '../application/create-organization.command'
import { DeleteOrganizationCommand } from '../application/delete-organization.command'
import { FollowOrganizationCommand } from '../application/follow-organization.command'
import { GetOrganizationQuery } from '../application/get-organization.query'
import { GetOrganizationByIdQuery } from '../application/get-organization-by-id.query'
import { GetOrganizationsFollowedByQuery } from '../application/get-organizations-followed-by.query'
import { GetUserOrganizationsQuery } from '../application/get-user-organizations.query'
import { MatchOrganizationsQuery } from '../application/match-organizations.query'
import { RemoveOrganizerCommand } from '../application/remove-organizer.command'
import { SaveOrganizationCommand } from '../application/save-organization.command'
import { UnfollowOrganizationCommand } from '../application/unfollow-organization.command'
import { UserIsOrganizerEnsurer } from '../application/user-is-organizer-ensurer.service'
import { AstroDbOrganizationsRepository } from '../infrastructure/astro-db-organizations.repository'

const builder = new ContainerBuilder()

// Register the concrete implementation
builder.register(AstroDbOrganizationsRepository).use(AstroDbOrganizationsRepository)

builder.register(GetOrganizationQuery).use(GetOrganizationQuery).withDependencies([AstroDbOrganizationsRepository])

builder
  .register(GetOrganizationByIdQuery)
  .use(GetOrganizationByIdQuery)
  .withDependencies([AstroDbOrganizationsRepository])

builder
  .register(GetUserOrganizationsQuery)
  .use(GetUserOrganizationsQuery)
  .withDependencies([AstroDbOrganizationsRepository])

builder
  .register(GetOrganizationsFollowedByQuery)
  .use(GetOrganizationsFollowedByQuery)
  .withDependencies([AstroDbOrganizationsRepository])

builder
  .register(MatchOrganizationsQuery)
  .use(MatchOrganizationsQuery)
  .withDependencies([AstroDbOrganizationsRepository])

builder
  .register(CreateOrganizationCommand)
  .use(CreateOrganizationCommand)
  .withDependencies([AstroDbOrganizationsRepository])

builder
  .register(SaveOrganizationCommand)
  .use(SaveOrganizationCommand)
  .withDependencies([AstroDbOrganizationsRepository])

builder
  .register(DeleteOrganizationCommand)
  .use(DeleteOrganizationCommand)
  .withDependencies([AstroDbOrganizationsRepository])

builder
  .register(FollowOrganizationCommand)
  .use(FollowOrganizationCommand)
  .withDependencies([AstroDbOrganizationsRepository])

builder
  .register(UnfollowOrganizationCommand)
  .use(UnfollowOrganizationCommand)
  .withDependencies([AstroDbOrganizationsRepository])

builder.register(AddOrganizerCommand).use(AddOrganizerCommand).withDependencies([AstroDbOrganizationsRepository])

builder.register(RemoveOrganizerCommand).use(RemoveOrganizerCommand).withDependencies([AstroDbOrganizationsRepository])

// biome-ignore lint/correctness/useHookAtTopLevel: useFactory is a diod container method, not a React hook
builder.register(UserIsOrganizerEnsurer).useFactory(() => {
  return new UserIsOrganizerEnsurer(
    new GetUserOrganizationsQuery(new AstroDbOrganizationsRepository()),
    UsersContainer.get(GetUserQuery),
    UsersContainer.get(CheckUserIsAdminQuery),
  )
})

export const OrganizationsContainer = builder.build({ autowire: false })
