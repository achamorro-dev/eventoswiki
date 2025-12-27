import { defineAction } from 'astro:actions'
import { createDeleteLoggedUserCommand } from '@/authentication/di/authentication.container'

export const deleteLoggedUserAction = defineAction({
  accept: 'json',
  handler: async (_, context) => {
    const { user, session } = context.locals
    if (!user || !session) {
      return null
    }

    const command = createDeleteLoggedUserCommand(context.cookies)
    await command.execute({
      sessionId: session.id,
      userId: user.id,
    })

    return null
  },
})
