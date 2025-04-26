import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Button } from '@/ui/components/button'
import { ErrorMessage } from '@/ui/components/error-message/error-message'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { At, Envelope, User as UserIcon } from '@/ui/icons'
import { Input } from '@/ui/input'
import type { User } from '@/users/domain/user'
import { type FC } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import styles from './edit-user-profile-form.module.css'
import type { UserFormSchema } from './user-form-schema'

interface Props {
  form: UseFormReturn<UserFormSchema>
  user: Primitives<User>
  onSubmit: (values: UserFormSchema) => Promise<void>
  error: string | null
}

export const EditUserProfileForm: FC<Props> = props => {
  const { form, onSubmit, user, error } = props

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="user-profile-form" className={styles.form}>
        <section>
          <img src={user.avatar.toString()} alt="Avatar" className={styles.avatar} />
        </section>
        <section className={styles['form-inputs']}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles['form-label']}>
                  <UserIcon size={16} />
                  Nombre
                </FormLabel>
                <FormControl>
                  <Input placeholder="Pedro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles['form-label']}>
                  <Envelope size={16} />
                  Email
                </FormLabel>
                <FormControl>
                  <Input placeholder="pedro@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles['form-label']}>
                  <At size={16} />
                  Nombre de usuario
                </FormLabel>
                <FormControl>
                  <Input placeholder="pedro123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        {error && <ErrorMessage message={error} />}
        <div className={styles.action}>
          <Button variant="default" disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
