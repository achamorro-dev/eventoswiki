import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { RemoveOrganizerCommand } from '@/organizations/application/remove-organizer.command'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { CannotRemoveLastOrganizerError } from '@/organizations/domain/errors/cannot-remove-last-organizer.error'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'

export const leaveOrganizationAction = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { organizationId } = input
      const requesterId = context.locals.user?.id

      if (!requesterId) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado',
        })
      }

      await OrganizationsContainer.get(RemoveOrganizerCommand).execute({
        organizationId,
        organizerIdToRemove: requesterId,
        requesterId,
      })

      return { success: true }
    } catch (error) {
      switch (true) {
        case error instanceof OrganizationNotFound:
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'Organización no encontrada',
          })
        case error instanceof CannotRemoveLastOrganizerError:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'No puedes abandonar la organización porque eres el último organizador',
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al abandonar la organización',
          })
      }
    }
  },
})
