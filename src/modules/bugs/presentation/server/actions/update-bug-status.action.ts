import { ActionError, defineAction } from 'astro:actions'
import { CheckUserIsAdminQuery } from '@/modules/users/application/check-user-is-admin.query'
import { GetUserQuery } from '@/modules/users/application/get-user.query'
import { UsersContainer } from '@/modules/users/di/users.container'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'
import { UpdateBugStatusCommand } from '../../../application/update-bug-status.command'
import { BugsContainer } from '../../../di/bugs.container'
import { updateBugStatusActionSchema } from './update-bug-status-action.schema'

export const updateBugStatusAction = defineAction({
  accept: 'json',
  input: updateBugStatusActionSchema,
  handler: async (input, context) => {
    const sessionUser = context.locals.user
    if (!sessionUser) {
      throw new ActionError({
        code: 'UNAUTHORIZED',
        message: 'No autorizado',
      })
    }

    let isAdmin = false
    try {
      const userEntity = await UsersContainer.get(GetUserQuery).execute({ id: sessionUser.id })
      if (!userEntity || !userEntity.email) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: 'Usuario no encontrado o sin email',
        })
      }

      isAdmin = await UsersContainer.get(CheckUserIsAdminQuery).execute({ email: userEntity.email })
    } catch (e) {
      if (e instanceof ActionError) throw e
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error verificando permisos',
      })
    }

    try {
      await BugsContainer.get(UpdateBugStatusCommand).execute({
        bugId: input.bugId,
        status: input.status,
        userId: sessionUser.id,
        isAdmin,
      })
      return
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new ActionError({
          code: 'FORBIDDEN',
          message: error.message,
        })
      }
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al actualizar el estado',
      })
    }
  },
})
