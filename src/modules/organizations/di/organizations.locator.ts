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
import type { OrganizationsRepository } from '../domain/organizations.repository'
import { AstroDbOrganizationsRepository } from '../infrastructure/astro-db-organizations.repository'

export class OrganizationsLocator {
  static getOrganizationQuery() {
    return new GetOrganizationQuery(OrganizationsLocator.getOrganizationsRepository())
  }

  static createOrganizationCommand() {
    return new CreateOrganizationCommand(OrganizationsLocator.getOrganizationsRepository())
  }

  static getOrganizationsRepository(): OrganizationsRepository {
    return new AstroDbOrganizationsRepository()
  }

  static getUserOrganizationsQuery(): GetUserOrganizationsQuery {
    return new GetUserOrganizationsQuery(OrganizationsLocator.getOrganizationsRepository())
  }

  static updateOrganizationCommand() {
    return new SaveOrganizationCommand(OrganizationsLocator.getOrganizationsRepository())
  }

  static getOrganizationByIdQuery() {
    return new GetOrganizationByIdQuery(OrganizationsLocator.getOrganizationsRepository())
  }

  static deleteOrganizationCommand() {
    return new DeleteOrganizationCommand(OrganizationsLocator.getOrganizationsRepository())
  }

  static followOrganizationCommand() {
    return new FollowOrganizationCommand(OrganizationsLocator.getOrganizationsRepository())
  }

  static unfollowOrganizationCommand() {
    return new UnfollowOrganizationCommand(OrganizationsLocator.getOrganizationsRepository())
  }

  static getOrganizationsFollowedByQuery() {
    return new GetOrganizationsFollowedByQuery(OrganizationsLocator.getOrganizationsRepository())
  }

  static matchOrganizationsQuery() {
    return new MatchOrganizationsQuery(OrganizationsLocator.getOrganizationsRepository())
  }

  static userIsOrganizerEnsurer(): UserIsOrganizerEnsurer {
    return new UserIsOrganizerEnsurer(OrganizationsLocator.getUserOrganizationsQuery())
  }
}
