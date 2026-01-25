'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Loader } from '@/ui/icons'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { Urls } from '@/ui/urls/urls'

const featureRequestSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
})

type FeatureRequestFormValues = z.infer<typeof featureRequestSchema>

export default function CreateFeatureRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FeatureRequestFormValues>({
    resolver: zodResolver(featureRequestSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onSubmit = async (data: FeatureRequestFormValues) => {
    setIsSubmitting(true)
    try {
      const { error } = await actions.featureRequests.createFeatureRequestAction(data)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Solicitud creada correctamente')
      form.reset()

      navigate(Urls.FEATURE_REQUEST)
    } catch (_error) {
      toast.error('Error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Modo oscuro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe la funcionalidad..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader className="mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Solicitud'
          )}
        </Button>
      </form>
    </Form>
  )
}
