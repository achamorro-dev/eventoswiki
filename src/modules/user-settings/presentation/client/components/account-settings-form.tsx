'use client'

import { type FC, useEffect, useRef } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { useUploadFile } from '@/files/presentation/client/hooks/use-upload-file'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { At, Camera, User as UserIcon } from '@/ui/icons'
import { Input } from '@/ui/input'
import styles from './account-settings-form.module.css'
import type { AccountSettingsFormSchema } from './account-settings-form-schema'

interface Props {
  form: UseFormReturn<AccountSettingsFormSchema>
  onSubmit: (values: AccountSettingsFormSchema) => Promise<void>
  error: string | null
}

export const AccountSettingsForm: FC<Props> = ({ form, onSubmit, error }) => {
  const { onInputFile, isLoading, image } = useUploadFile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (image) {
      form.setValue('avatar', image.toString())
    }
  }, [image, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="account-settings-form" className={styles.form}>
        <section>
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={form.watch('avatar') || undefined} alt="Avatar" />
              <AvatarFallback>{form.watch('name').slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              type="button"
              size="icon"
              className="-mt-8 z-1 ml-12"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <input type="file" id="image" ref={fileInputRef} className="hidden" onChange={onInputFile} />
          </div>
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
        {error && <div className="text-destructive text-sm">{error}</div>}
        <div className={styles.action}>
          <Button variant="default" disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
