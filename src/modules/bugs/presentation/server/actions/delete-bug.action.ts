import { ActionError, defineAction } from 'astro:actions'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'
import { DeleteBugCommand } from '../../../application/delete-bug.command'
import { BugsContainer } from '../../../di/bugs.container'
import { BugNotFound } from '../../../domain/errors/bug-not-found.error'
import { deleteBugActionSchema } from './delete-bug-action.schema'

export const deleteBugAction = defineAction({
  accept: 'json',
  input: deleteBugActionSchema,
  handler: async (input, context) => {
    const { user } = context.locals
    if (!user) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'No autorizado',
      })
    }

    try {
      await BugsContainer.get(DeleteBugCommand).execute({
        bugId: input.bugId,
        userId: user.id,
      })

      return null
    } catch (error) {
      switch (true) {
        case error instanceof BugNotFound:
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'Bug no encontrado',
          })
        case error instanceof BadRequest:
          throw new ActionError({
            code: 'FORBIDDEN',
            message: error.message,
          })
        default:
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Se ha producido un error al eliminar el bug',
          })
      }
    }
  },
})
