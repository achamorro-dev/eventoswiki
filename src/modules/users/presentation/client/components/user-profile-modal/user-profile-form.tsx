import type { Primitives } from '@/shared/domain/primitives/primitives'
import { InputText } from '@/ui/components/form/input-text/input-text'
import type { User } from '@/users/domain/user'
import { useForm, zodResolver } from '@mantine/form'
import { z } from 'astro/zod'
import { actions } from 'astro:actions'
import { useEffect, type FC } from 'react'
import styles from './user-profile-form.module.css'

interface Props {
  user: Primitives<User>
}

export const UserProfileForm: FC<Props> = props => {
  const { user } = props

  const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email().nullable(),
    username: z.string().min(3),
  })
  const form = useForm({ initialValues: user, validate: zodResolver(userSchema) })

  useEffect(() => {
    const validateForm = async () => {
      const { hasErrors } = form.validate()
      if (hasErrors) return

      await actions.user.saveUserAction({
        name: form.values.name,
        email: form.values.email,
        username: form.values.username,
      })

      document.dispatchEvent(new Event('user-profile-form-saved'))
    }

    document.addEventListener('user-profile-form-save-clicked', validateForm)

    return () => {
      document.removeEventListener('user-profile-form-save-clicked', validateForm)
    }
  }, [form])

  useEffect(() => {
    const resetForm = () => {
      form.reset()
      form.setValues(user)
      document.dispatchEvent(new Event('user-profile-form-canceled'))
    }

    document.addEventListener('user-profile-form-cancel-clicked', resetForm)

    return () => {
      document.removeEventListener('user-profile-form-cancel-clicked', resetForm)
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
    </form>
  )
}
