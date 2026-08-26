import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { SearchOrganizationsQuery } from '@/organizations/application/search-organizations.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'

export const searchOrganizationsAction = defineAction({
  accept: 'json',
  input: z.object({
    query: z.string(),
    limit: z.number().optional(),
  }),
  handler: async (input, context) => {
    if (!context.locals.user?.id) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'No estás autorizado para buscar organizaciones',
      })
    }

    const organizations = await OrganizationsContainer.get(SearchOrganizationsQuery).execute({
      query: input.query,
      limit: input.limit,
    })

    return {
      organizations: organizations.data.map(organization => ({
        id: organization.id.value,
        handle: organization.handle,
        name: organization.name,
        image: organization.image?.toString(),
      })),
    }
  },
})
