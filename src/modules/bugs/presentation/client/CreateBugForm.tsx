'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Checkbox } from '@/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Loader } from '@/ui/icons'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'

const bugSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  isPrivate: z.boolean(),
})

type BugFormValues = z.infer<typeof bugSchema>

export default function CreateBugForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BugFormValues>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      title: '',
      description: '',
      isPrivate: false,
    },
  })

  const onSubmit = async (data: BugFormValues) => {
    setIsSubmitting(true)
    try {
      const { error } = await actions.bugs.createBugAction(data)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Bug reportado correctamente')
      form.reset()
      navigate('/bugs')
    } catch (_error) {
      toast.error('Error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-border bg-muted/50">
      <CardHeader>
        <CardTitle>Reportar un error</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Error al iniciar sesión" {...field} />
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
                    <Textarea placeholder="Describe el error encontrado..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bug Privado</FormLabel>
                    <FormDescription>
                      Si marcas esta opción, solo tú y los administradores podréis ver este reporte.
                    </FormDescription>
                  </div>
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
                'Reportar Bug'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
