import { z } from 'astro/zod'

export const userSettingsFormSchema = z.object({
  meetupAttendanceEmailEnabled: z.boolean(),
  organizationUpdatesEmailEnabled: z.boolean(),
})

export type UserSettingsFormSchema = z.infer<typeof userSettingsFormSchema>
