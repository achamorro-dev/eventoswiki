'use client'

import { actions } from 'astro:actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { type FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { AccountSettingsForm } from '@/user-settings/presentation/client/components/account-settings-form'
import type { AccountSettingsFormSchema } from '@/user-settings/presentation/client/components/account-settings-form-schema'
import { accountSettingsFormSchema } from '@/user-settings/presentation/client/components/account-settings-form-schema'

interface Props {
  user: {
    id: string
    name: string
    username: string
    email: string | null
    avatar: string | null
  }
}

export const AccountSettingsPage: FC<Props> = ({ user }) => {
  const [accountSettingsError, setAccountSettingsError] = useState<string | null>(null)

  const accountSettingsForm = useForm<AccountSettingsFormSchema>({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      avatar: user.avatar || undefined,
    },
  })

  const handleAccountSubmit = async (values: AccountSettingsFormSchema) => {
    try {
      setAccountSettingsError(null)
      await actions.user.saveUserAction({
        ...values,
        email: user.email,
        avatar: values.avatar ?? null,
      })
      toast.success('Perfil actualizado correctamente')
    } catch (error: unknown) {
      setAccountSettingsError(error instanceof Error ? error.message : 'Error al actualizar el perfil')
      toast.error('Error al actualizar el perfil')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del perfil</CardTitle>
        <CardDescription>Actualiza la información de tu perfil público</CardDescription>
      </CardHeader>
      <CardContent>
        <AccountSettingsForm form={accountSettingsForm} onSubmit={handleAccountSubmit} error={accountSettingsError} />
      </CardContent>
    </Card>
  )
}
