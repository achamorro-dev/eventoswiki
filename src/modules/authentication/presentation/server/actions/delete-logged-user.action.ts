import { AuthenticationLocator } from '@/authentication/di/authentication.locator'
import { defineAction } from 'astro:actions'

export const deleteLoggedUserAction = defineAction({
  handler: async (_, context) => {
    const { user, session } = context.locals
    if (!user || !session) {
      return null
    }

    await AuthenticationLocator.deleteLoggedUserCommand(context.cookies).execute({
      sessionId: session.id,
      userId: user.id,
    })

    return null
  },
})
