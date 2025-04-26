import { OrganizationsLocator } from '@/organizations/di/organizations.locator'
import { z } from 'astro/zod'
import { ActionError, defineAction } from 'astro:actions'

export const createOrganizationAction = defineAction({
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
    organizerId: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { organizerId, ...newOrganization } = input

      await OrganizationsLocator.createOrganizationCommand().execute({ organizerId, ...newOrganization })

      return
    } catch (error) {
      switch (true) {
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al crear la organización',
          })
      }
    }
  },
})
