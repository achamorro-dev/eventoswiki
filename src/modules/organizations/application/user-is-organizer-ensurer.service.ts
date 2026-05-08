import type { CheckUserIsAdminQuery } from '@/users/application/check-user-is-admin.query'
import type { GetUserQuery } from '@/users/application/get-user.query'
import { OrganizerNotFound } from '../domain/errors/organizer-not-found.error'
import type { GetUserOrganizationsQuery } from './get-user-organizations.query'

interface Param {
  userId: string
  organizationId: string
}

export class UserIsOrganizerEnsurer {
  constructor(
    private readonly getUserOrganizationsQuery: GetUserOrganizationsQuery,
    private readonly getUserQuery: GetUserQuery,
    private readonly checkUserIsAdminQuery: CheckUserIsAdminQuery,
  ) {}

  async ensure(param: Param): Promise<void> {
    const { userId, organizationId } = param

    const userEntity = await this.getUserQuery.execute({ id: userId })
    if (userEntity?.email) {
      const isAdmin = await this.checkUserIsAdminQuery.execute({ email: userEntity.email })
      if (isAdmin) return
    }

    const organizations = await this.getUserOrganizationsQuery.execute({ userId })

    const userNotOrganizeTheOrganization = !organizations.some(organization => organization.id.value === organizationId)

    if (userNotOrganizeTheOrganization) {
      throw new OrganizerNotFound(userId)
    }
  }
}
