import { defineAction } from 'astro:actions'
import { AuthenticationLocator } from '@/authentication/di/authentication.locator'

export const deleteLoggedUserAction = defineAction({
  accept: 'json',
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
