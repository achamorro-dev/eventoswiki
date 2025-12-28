import { ContainerBuilder } from 'diod'
import { CreateOrganizationCommand } from '../application/create-organization.command'
import { DeleteOrganizationCommand } from '../application/delete-organization.command'
import { FollowOrganizationCommand } from '../application/follow-organization.command'
import { GetOrganizationQuery } from '../application/get-organization.query'
import { GetOrganizationByIdQuery } from '../application/get-organization-by-id.query'
import { GetOrganizationsFollowedByQuery } from '../application/get-organizations-followed-by.query'
import { GetUserOrganizationsQuery } from '../application/get-user-organizations.query'
import { MatchOrganizationsQuery } from '../application/match-organizations.query'
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

builder.register(UserIsOrganizerEnsurer).use(UserIsOrganizerEnsurer).withDependencies([GetUserOrganizationsQuery])

export const OrganizationsContainer = builder.build({ autowire: false })
