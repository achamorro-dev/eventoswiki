import { OrganizerNotFound } from '../domain/errors/organizer-not-found.error'
import type { GetUserOrganizationsQuery } from './get-user-organizations.query'

interface Param {
  userId: string
  organizationId: string
}

export class UserIsOrganizerEnsurer {
  constructor(private readonly getUserOrganizationsQuery: GetUserOrganizationsQuery) {}

  async ensure(param: Param): Promise<void> {
    const { userId, organizationId } = param

    const organizations = await this.getUserOrganizationsQuery.execute({ userId })

    const userNotOrganizeTheOrganization = !organizations.some(organization => organization.id.value === organizationId)

    if (userNotOrganizeTheOrganization) {
      throw new OrganizerNotFound(userId)
    }
  }
}
