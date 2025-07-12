import { OrganizationsLocator } from '@/organizations/di/organizations.locator'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'
import { z } from 'astro/zod'
import { ActionError, defineAction } from 'astro:actions'

export const followOrganizationAction = defineAction({
  input: z.object({
    organizationId: z.string(),
    userId: z.string(),
  }),
  handler: async input => {
    try {
      const { organizationId, userId } = input

      await OrganizationsLocator.followOrganizationCommand().execute({
        organizationId,
        userId,
      })
    } catch (error) {
      switch (true) {
        case error instanceof OrganizationNotFound:
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'Organización no encontrada',
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al guardar la organización',
          })
      }
    }
  },
})
