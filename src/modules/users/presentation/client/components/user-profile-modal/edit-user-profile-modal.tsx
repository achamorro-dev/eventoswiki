import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Button } from '@/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/ui/drawer'
import { useMediaQuery } from '@/ui/hooks/use-media-query'
import type { User } from '@/users/domain/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'astro/zod'
import { actions } from 'astro:actions'
import { useCallback, useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { EditUserProfileForm } from './form/edit-user-profile-form'
import { userFormSchema } from './form/user-form-schema'

interface Props {
  user: Primitives<User>
}

export const EditUserProfileModalForm: FC<Props> = props => {
  const { user } = props
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const form = useForm<z.infer<typeof userFormSchema>>({
    defaultValues: {
      name: user.name,
      email: user.email ?? undefined,
      username: user.username,
    },
    resolver: zodResolver(userFormSchema),
  })

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
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

    toast.success('Perfil actualizado correctamente')
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

  if (isMobile) {
    return (
      <>
        <Drawer onOpenChange={onOpenChange}>
          <DrawerTrigger asChild>
            <Button variant="secondary">Editar perfil</Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 pb-4">
            <DrawerHeader>
              <DrawerTitle>Editar perfil</DrawerTitle>
            </DrawerHeader>
            <EditUserProfileForm form={form} onSubmit={onSubmit} user={user} error={error} />
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Editar perfil</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <EditUserProfileForm form={form} onSubmit={onSubmit} user={user} error={error} />
      </DialogContent>
    </Dialog>
  )
}
