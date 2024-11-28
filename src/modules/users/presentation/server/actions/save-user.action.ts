import { UsersLocator } from '@/users/di/users.locator'
import { z } from 'astro/zod'
import { defineAction } from 'astro:actions'

export const saveUserAction = defineAction({
  input: z.object({
    name: z.string(),
    email: z.string().email().nullable(),
    username: z.string(),
  }),
  handler: async (input, context) => {
    const { name, email, username } = input
    const userId = context.locals.user?.id

    if (!userId) {
      return null
    }

    await UsersLocator.saveUserCommand().execute({ userId, name, email, username })

    return
  },
})
