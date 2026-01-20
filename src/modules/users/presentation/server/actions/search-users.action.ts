import { defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { SearchUsersQuery } from '@/users/application/search-users.query'
import { UsersContainer } from '@/users/di/users.container'

export const searchUsersAction = defineAction({
  accept: 'json',
  input: z.object({
    query: z.string(),
    organizationId: z.string(),
  }),
  handler: async input => {
    const { query, organizationId } = input

    const organization = await OrganizationsContainer.get(GetOrganizationByIdQuery).execute({
      id: organizationId,
    })

    const users = await UsersContainer.get(SearchUsersQuery).execute({
      query,
      excludeUserIds: organization.organizers,
      limit: 10,
    })

    return {
      users: users.data.map(user => user.toPrimitives()),
    }
  },
})
