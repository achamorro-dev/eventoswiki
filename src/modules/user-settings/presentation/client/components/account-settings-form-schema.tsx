import { z } from 'astro/zod'
import { StringFormField } from '@/shared/presentation/forms/string-form-field'
import { UserNameValidator } from '@/users/domain/validators/user-name.validator'
import { UserUsernameValidator } from '@/users/domain/validators/user-username.validator'

export const accountSettingsFormSchema = z.object({
  name: StringFormField(UserNameValidator),
  username: StringFormField(UserUsernameValidator),
  avatar: z.string().nullable().optional(),
})

export type AccountSettingsFormSchema = z.infer<typeof accountSettingsFormSchema>
