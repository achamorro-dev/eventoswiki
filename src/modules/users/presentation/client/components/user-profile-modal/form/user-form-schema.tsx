import { StringFormField } from '@/shared/presentation/forms/string-form-field'
import { UserEmailValidator } from '@/users/domain/validators/user-email.validator'
import { UserNameValidator } from '@/users/domain/validators/user-name.validator'
import { UserUsernameValidator } from '@/users/domain/validators/user-username.validator'
import { z } from 'astro/zod'

export const userFormSchema = z.object({
  name: StringFormField(UserNameValidator),
  email: StringFormField<string | null>(UserEmailValidator),
  username: StringFormField(UserUsernameValidator),
})

export type UserFormSchema = z.infer<typeof userFormSchema>
