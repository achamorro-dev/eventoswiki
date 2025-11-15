import { type FC, useEffect, useRef } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { useUploadFile } from '@/files/presentation/client/hooks/use-upload-file'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/components/button'
import { ErrorMessage } from '@/ui/components/error-message/error-message'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { At, Camera, Envelope, Loader, User as UserIcon } from '@/ui/icons'
import { Input } from '@/ui/input'
import styles from './edit-user-profile-form.module.css'
import type { UserFormSchema } from './user-form-schema'

interface Props {
  form: UseFormReturn<UserFormSchema>
  onSubmit: (values: UserFormSchema) => Promise<void>
  error: string | null
}

export const EditUserProfileForm: FC<Props> = props => {
  const { form, onSubmit, error } = props
  const { onInputFile, isLoading, image } = useUploadFile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (image) {
      form.setValue('avatar', image.toString())
    }
  }, [image])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="user-profile-form" className={styles.form}>
        <section>
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={form.watch('avatar')} alt="Avatar" />
              <AvatarFallback>{form.watch('name').slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              type="button"
              size="icon"
              className="z-1 -mt-8 ml-12"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
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
