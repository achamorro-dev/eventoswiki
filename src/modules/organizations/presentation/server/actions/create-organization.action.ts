import { z } from 'astro/zod'
import { defineAction } from 'astro:actions'

export const createOrganizationAction = defineAction({
  input: z.object({
    name: z.string(),
    email: z.string().email().nullable(),
    username: z.string(),
  }),
  handler: async (input, context) => {},
})
