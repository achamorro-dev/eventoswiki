import { ActionError, defineAction } from 'astro:actions'
import { CreateBugCommand } from '../../../application/create-bug.command'
import { BugsContainer } from '../../../di/bugs.container'
import { createBugActionSchema } from './create-bug-action.schema'

export const createBugAction = defineAction({
  accept: 'json',
  input: createBugActionSchema,
  handler: async (input, context) => {
    const userId = context.locals.user?.id
    if (!userId) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'Debes iniciar sesión para reportar un bug',
      })
    }

    try {
      await BugsContainer.get(CreateBugCommand).execute({
        title: input.title,
        description: input.description,
        isPrivate: input.isPrivate,
        userId,
      })
      return
    } catch (_error) {
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al crear el reporte',
      })
    }
  },
})
