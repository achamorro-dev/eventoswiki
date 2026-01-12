import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { UpdateUserSettingsCommand } from '@/user-settings/application/update-user-settings.command'
import { UserSettingsContainer } from '@/user-settings/di/user-settings.container'

export const saveUserSettingsAction = defineAction({
  accept: 'json',
  input: z.object({
    meetupAttendanceEmailEnabled: z.boolean(),
    organizationUpdatesEmailEnabled: z.boolean(),
  }),
  handler: async (input, context) => {
    try {
      const { meetupAttendanceEmailEnabled, organizationUpdatesEmailEnabled } = input
      const userId = context.locals.user?.id

      if (!userId) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado',
        })
      }

      await UserSettingsContainer.get(UpdateUserSettingsCommand).execute({
        userId,
        meetupAttendanceEmailEnabled,
        organizationUpdatesEmailEnabled,
      })

      return
    } catch (_) {
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Se ha producido un error al guardar las preferencias de notificación',
      })
    }
  },
})
