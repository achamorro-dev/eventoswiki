import { CreateOrganizationCommand } from '../application/create-organization.command'
import { DeleteOrganizationCommand } from '../application/delete-organization.command'
import { FollowOrganizationCommand } from '../application/follow-organization.command'
import { GetOrganizationByIdQuery } from '../application/get-organization-by-id.query'
import { GetOrganizationQuery } from '../application/get-organization.query'
import { GetOrganizationsFollowedByQuery } from '../application/get-organizations-followed-by.query'
import { GetUserOrganizationsQuery } from '../application/get-user-organizations.query'
import { SaveOrganizationCommand } from '../application/save-organization.command'
import { UnfollowOrganizationCommand } from '../application/unfollow-organization.command'
import type { OrganizationsRepository } from '../domain/organizations.repository'
import { AstroDbOrganizationsRepository } from '../infrastructure/astro-db-organizations.repository'

export class OrganizationsLocator {
  static getOrganizationQuery() {
    return new GetOrganizationQuery(this.getOrganizationsRepository())
  }

  static createOrganizationCommand() {
    return new CreateOrganizationCommand(this.getOrganizationsRepository())
  }

  static getOrganizationsRepository(): OrganizationsRepository {
    return new AstroDbOrganizationsRepository()
  }

  static getUserOrganizationsQuery(): GetUserOrganizationsQuery {
    return new GetUserOrganizationsQuery(this.getOrganizationsRepository())
  }

  static updateOrganizationCommand() {
    return new SaveOrganizationCommand(this.getOrganizationsRepository())
  }

  static getOrganizationByIdQuery() {
    return new GetOrganizationByIdQuery(this.getOrganizationsRepository())
  }

  static deleteOrganizationCommand() {
    return new DeleteOrganizationCommand(this.getOrganizationsRepository())
  }

  static followOrganizationCommand() {
    return new FollowOrganizationCommand(this.getOrganizationsRepository())
  }

  static unfollowOrganizationCommand() {
    return new UnfollowOrganizationCommand(this.getOrganizationsRepository())
  }

  static getOrganizationsFollowedByQuery() {
    return new GetOrganizationsFollowedByQuery(this.getOrganizationsRepository())
  }
}
