import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { AddOrganizerCommand } from '@/organizations/application/add-organizer.command'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { OnlyOrganizersCanAddOrganizersError } from '@/organizations/domain/errors/only-organizers-can-add-organizers.error'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'

export const addOrganizerAction = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z.string(),
    organizerId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { organizationId, organizerId } = input
      const requesterId = context.locals.user?.id

      if (!requesterId) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado',
        })
      }

      await OrganizationsContainer.get(AddOrganizerCommand).execute({
        organizationId,
        organizerId,
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
        case error instanceof OnlyOrganizersCanAddOrganizersError:
          throw new ActionError({
            code: 'FORBIDDEN',
            message: 'Solo los organizadores pueden añadir nuevos organizadores',
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al añadir el organizador',
          })
      }
    }
  },
})
