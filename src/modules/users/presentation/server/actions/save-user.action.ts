import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { UsersLocator } from '@/users/di/users.locator'
import { InvalidUserProfileError } from '@/users/domain/errors/invalid-user-profile.error'
import { UserNotFoundError } from '@/users/domain/errors/user-not-found.error'
import { UsernameAlreadyExistError } from '@/users/domain/errors/username-already-exist.error'

export const saveUserAction = defineAction({
  accept: 'json',
  input: z.object({
    name: z.string(),
    email: z.string().email().nullable(),
    username: z.string(),
    avatar: z.string().nullable(),
  }),
  handler: async (input, context) => {
    try {
      const { name, email, username, avatar } = input
      const userId = context.locals.user?.id

      if (!userId) {
        return null
      }

      await UsersLocator.saveUserCommand().execute({ userId, name, email, username, avatar })

      return
    } catch (error) {
      switch (true) {
        case error instanceof UserNotFoundError:
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'El usuario no existe',
          })
        case error instanceof InvalidUserProfileError:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'El formato del nuevo perfil del usuario no es válido',
          })
        case error instanceof UsernameAlreadyExistError:
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'El nombre de usuario no está disponible',
          })

        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al guardar el perfil del usuario',
          })
      }
    }
  },
})
