import type { Primitives } from '@/shared/domain/primitives/primitives'
import { StringFormField } from '@/shared/presentation/forms/string-form-field'
import { Button } from '@/ui/components/button'
import { ErrorMessage } from '@/ui/components/error-message/error-message'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import type { User } from '@/users/domain/user'
import { UserEmailValidator } from '@/users/domain/validators/user-email.validator'
import { UserNameValidator } from '@/users/domain/validators/user-name.validator'
import { UserUsernameValidator } from '@/users/domain/validators/user-username.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'astro/zod'
import { actions } from 'astro:actions'
import { useCallback, useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import styles from './user-profile-modal-form.module.css'

interface Props {
  user: Primitives<User>
}

const userSchema = z.object({
  name: StringFormField(UserNameValidator),
  email: StringFormField<string | null>(UserEmailValidator),
  username: StringFormField(UserUsernameValidator),
})

export const UserProfileModalForm: FC<Props> = props => {
  const { user } = props
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof userSchema>>({
    defaultValues: {
      name: user.name,
      email: user.email ?? undefined,
      username: user.username,
    },
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    setError(null)
    const { error } = await actions.user.saveUserAction({
      name: values.name,
      email: values.email,
      username: values.username,
    })

    if (error) {
      setError(error.message)
      return
    }
  }

  const resetForm = useCallback(() => {
    form.reset()
    form.clearErrors()
    form.setValue('name', user.name)
    form.setValue('email', user.email ?? '')
    form.setValue('username', user.username)
  }, [form, user])

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        resetForm()
      }
    },
    [resetForm],
  )

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Editar perfil</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="user-profile-form" className={styles.form}>
            <DialogHeader>
              <DialogTitle>Editar perfil</DialogTitle>
            </DialogHeader>
            <section>
              <img src={user.avatar.toString()} alt="Avatar" width="180" height="180" className={styles.avatar} />
            </section>
            <section className={styles['form-inputs']}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="pedro123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            {error && <ErrorMessage message={error} />}
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button variant="default" type="submit">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
