import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { OrganizationsLocator } from '@/organizations/di/organizations.locator'
import { OrganizationAlreadyExists } from '@/organizations/domain/errors/organization-already-exists.error'
import type { OrganizationEditableData } from '@/organizations/domain/organization'
import { saveOrganizationActionSchema } from './save-organization-action.schema'

export const saveOrganizationAction = defineAction({
  accept: 'json',
  input: saveOrganizationActionSchema,
  handler: async (input, context) => {
    try {
      const { organizationId } = input
      const organizerId = context.locals.user?.id
      if (!organizerId) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'No estás autorizado para guardar esta organización',
        })
      }
      const newOrganization = _parseOrganizationDataPayload(input)

      const isNewOrganization = !organizationId
      isNewOrganization
        ? await _createOrganization(organizerId, newOrganization)
        : await _saveOrganization(organizationId, newOrganization)

      return
    } catch (error) {
      switch (true) {
        case error instanceof OrganizationAlreadyExists:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'El nombre de la organización ya está en uso',
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

async function _createOrganization(organizerId: string, newOrganization: OrganizationEditableData) {
  await OrganizationsLocator.createOrganizationCommand().execute({
    organizerId,
    data: {
      ...newOrganization,
      location: newOrganization.location ?? null,
      followers: [],
    },
  })
}

async function _saveOrganization(organizationId: string, newOrganization: OrganizationEditableData) {
  await OrganizationsLocator.updateOrganizationCommand().execute({
    organizationId,
    data: {
      ...newOrganization,
      location: newOrganization.location ?? null,
      followers: newOrganization.followers ?? [],
    },
  })
}

function _parseOrganizationDataPayload(input: z.infer<typeof saveOrganizationActionSchema>): OrganizationEditableData {
  return {
    name: input.name,
    handle: input.handle,
    bio: input.bio,
    image: input.image,
    location: input.location ?? null,
    web: input.web,
    twitter: input.twitter,
    linkedin: input.linkedin,
    youtube: input.youtube,
    twitch: input.twitch,
    facebook: input.facebook,
    instagram: input.instagram,
    github: input.github,
    telegram: input.telegram,
    whatsapp: input.whatsapp,
    discord: input.discord,
    tiktok: input.tiktok,
    followers: input.followers ?? [],
  }
}
