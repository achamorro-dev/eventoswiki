import { CreateOrganizationCommand } from '../application/create-organization.command'
import { GetUserOrganizationsQuery } from '../application/get-user-organizations.query'
import type { OrganizationsRepository } from '../domain/organizations.repository'
import { AstroDbOrganizationsRepository } from '../infrastructure/astro-db-organizations.repository'

export class OrganizationsLocator {
  static createOrganizationCommand() {
    return new CreateOrganizationCommand(this.getOrganizationsRepository())
  }

  static getOrganizationsRepository(): OrganizationsRepository {
    return new AstroDbOrganizationsRepository()
  }

  static getUserOrganizationsQuery(): GetUserOrganizationsQuery {
    return new GetUserOrganizationsQuery(this.getOrganizationsRepository())
  }
}
