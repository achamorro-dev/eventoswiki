'use client'

import { actions } from 'astro:actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, CheckCircle2, Mail } from 'lucide-react'
import { type FC } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/ui/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/ui/form'
import { Switch } from '@/ui/switch'
import type { UserSettingsFormSchema } from './user-settings-form-schema'
import { userSettingsFormSchema } from './user-settings-form-schema'

interface Props {
  initialValues: UserSettingsFormSchema
}

export const NotificationSettingsForm: FC<Props> = ({ initialValues }) => {
  const form = useForm<UserSettingsFormSchema>({
    resolver: zodResolver(userSettingsFormSchema),
    defaultValues: initialValues,
  })

  const onSubmit = async (values: UserSettingsFormSchema) => {
    try {
      await actions.userSettings.saveUserSettingsAction({
        ...values,
      })
      form.reset(values)
      toast.success('Preferencias de notificación actualizadas')
    } catch (_) {
      toast.error('Error al actualizar las preferencias de notificación')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="meetupAttendanceEmailEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <FormLabel className="text-base">Confirmación de asistencia</FormLabel>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail size={14} />
                  Recibir email de confirmación al registrarte en un meetup
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={form.formState.isSubmitting} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organizationUpdatesEmailEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell size={18} />
                  <FormLabel className="text-base">Actualizaciones de organizaciones</FormLabel>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail size={14} />
                  Recibir notificaciones de nuevos eventos de tus organizaciones favoritas
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={form.formState.isSubmitting} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button variant="default" disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
