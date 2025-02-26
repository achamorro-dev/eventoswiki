import type { Primitives } from '@/shared/domain/primitives/primitives'
import { ErrorMessage } from '@/ui/components/error-message/error-message'
import { InputText } from '@/ui/components/form/input-text/input-text'
import type { User } from '@/users/domain/user'
import { UserEmailValidator } from '@/users/domain/validators/user-email.validator'
import { UserNameValidator } from '@/users/domain/validators/user-name.validator'
import { UserUsernameValidator } from '@/users/domain/validators/user-username.validator'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'astro/zod'
import { actions } from 'astro:actions'
import { useEffect, useState, type FC } from 'react'
import { StringFormField } from '../../../../../shared/presentation/forms/string-form-field'
import { UserProfileEvents } from '../../events/user-profile-events'
import styles from './user-profile-form.module.css'

interface Props {
  user: Primitives<User>
}

export const UserProfileForm: FC<Props> = props => {
  const { user } = props
  const [error, setError] = useState<string | null>(null)

  const userSchema = z.object({
    name: StringFormField(UserNameValidator),
    email: StringFormField<string | null>(UserEmailValidator),
    username: StringFormField(UserUsernameValidator),
  })
  const form = useForm({ initialValues: user, validate: zodResolver(userSchema) })

  useEffect(() => {
    const validateForm = async () => {
      setError(null)
      const { hasErrors } = form.validate()
      if (hasErrors) return

      const { error } = await actions.user.saveUserAction({
        name: form.values.name,
        email: form.values.email,
        username: form.values.username,
      })

      if (error) {
        setError(error.message)
        return
      }

      document.dispatchEvent(new Event(UserProfileEvents.SAVED))
    }

    document.addEventListener(UserProfileEvents.SAVE_CLICKED, validateForm)

    return () => {
      document.removeEventListener(UserProfileEvents.SAVE_CLICKED, validateForm)
    }
  }, [form])

  useEffect(() => {
    const resetForm = () => {
      form.reset()
      form.setValues(user)
      document.dispatchEvent(new Event(UserProfileEvents.CANCELED))
    }

    document.addEventListener(UserProfileEvents.CANCEL_CLICKED, resetForm)

    return () => {
      document.removeEventListener(UserProfileEvents.CANCEL_CLICKED, resetForm)
    }
  }, [form, user])

  return (
    <form id="user-profile-form" method="dialog" className={styles.form}>
      <section>
        <img src={user.avatar.toString()} alt="Avatar" width="180" height="180" className={styles.avatar} />
      </section>
      <section className={styles['form-inputs']}>
        <InputText label="Nombre" name="name" {...form.getInputProps('name')} />
        <InputText type="email" label="Email" name="email" {...form.getInputProps('email')} />
        <InputText label="Usuario" name="username" {...form.getInputProps('username')} />
      </section>
      {error && <ErrorMessage message={error} />}
    </form>
  )
}
