import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { UnfollowOrganizationCommand } from '@/organizations/application/unfollow-organization.command'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'

export const unfollowOrganizationAction = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { organizationId } = input
      const userId = context.locals.user?.id

      if (!userId) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado',
        })
      }

      await OrganizationsContainer.get(UnfollowOrganizationCommand).execute({
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
