import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { OrganizationsLocator } from '@/organizations/di/organizations.locator'
import { OrganizationAlreadyExists } from '@/organizations/domain/errors/organization-already-exists.error'

interface OrganizationDataPayload {
  handle: string
  name: string
  bio: string
  image?: string | undefined
  location?: string | undefined
  web?: string | undefined
  twitter?: string | undefined
  linkedin?: string | undefined
  youtube?: string | undefined
  twitch?: string | undefined
  facebook?: string | undefined
  instagram?: string | undefined
  github?: string | undefined
  telegram?: string | undefined
  whatsapp?: string | undefined
  discord?: string | undefined
  tiktok?: string | undefined
  followers?: string[] | undefined
}

export const saveOrganizationAction = defineAction({
  input: z.object({
    handle: z.string(),
    name: z.string(),
    bio: z.string(),
    image: z.string().optional(),
    location: z.string().optional(),
    web: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    twitch: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    github: z.string().optional(),
    telegram: z.string().optional(),
    whatsapp: z.string().optional(),
    discord: z.string().optional(),
    tiktok: z.string().optional(),
    followers: z.array(z.string()).optional(),
    organizerId: z.string(),
    organizationId: z.string().optional(),
  }),
  handler: async input => {
    try {
      const { organizerId, organizationId, ...newOrganization } = input

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

async function _createOrganization(organizerId: string, newOrganization: OrganizationDataPayload) {
  await OrganizationsLocator.createOrganizationCommand().execute({
    organizerId,
    data: {
      ...newOrganization,
      location: newOrganization.location ?? null,
      followers: [],
    },
  })
}

async function _saveOrganization(organizationId: string, newOrganization: OrganizationDataPayload) {
  await OrganizationsLocator.updateOrganizationCommand().execute({
    organizationId,
    data: {
      ...newOrganization,
      location: newOrganization.location ?? null,
      followers: newOrganization.followers ?? [],
    },
  })
}
