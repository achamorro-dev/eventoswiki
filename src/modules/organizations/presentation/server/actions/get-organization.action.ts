import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'

export const getOrganizationAction = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z.string(),
  }),
  handler: async (input, context) => {
    if (!context.locals.user?.id) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'No estás autorizado para ver la organización',
      })
    }

    try {
      const organization = await OrganizationsContainer.get(GetOrganizationByIdQuery).execute({
        id: input.organizationId,
      })

      return {
        organization: organization.toPrimitives(),
      }
    } catch (error) {
      if (error instanceof OrganizationNotFound) {
        throw new ActionError({
          code: 'NOT_FOUND',
          message: 'La organización no existe',
        })
      }

      throw error
    }
  },
})
