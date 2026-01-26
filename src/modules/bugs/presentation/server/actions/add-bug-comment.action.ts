import { ActionError, defineAction } from 'astro:actions'
import { AddBugCommentCommand } from '../../../application/add-bug-comment.command'
import { BugsContainer } from '../../../di/bugs.container'
import { addBugCommentActionSchema } from './add-bug-comment-action.schema'

export const addBugCommentAction = defineAction({
  accept: 'json',
  input: addBugCommentActionSchema,
  handler: async (input, context) => {
    const userId = context.locals.user?.id
    if (!userId) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'Debes iniciar sesión para comentar',
      })
    }

    try {
      await BugsContainer.get(AddBugCommentCommand).execute({
        bugId: input.bugId,
        content: input.content,
        userId,
      })
      return
    } catch (_error) {
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al añadir el comentario',
      })
    }
  },
})
