import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'astro/zod'
import { useEffect } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/ui/button'
import { DateTimePicker } from '@/ui/components/date-time-picker'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Textarea } from '@/ui/textarea'
import type { EventFormSchema } from '../event-edit-form/event-form-schema'

const commonElementSchema = z
  .object({
    title: z.string().min(1, 'El título es obligatorio'),
    description: z.string().optional(),
    startsAt: z.date({ required_error: 'La fecha de inicio es obligatoria' }),
    endsAt: z.date({ required_error: 'La fecha de fin es obligatoria' }),
    type: z.enum(['coffee-break', 'lunch', 'registration', 'keynote', 'other']),
  })
  .refine(data => data.endsAt > data.startsAt, {
    message: 'La fecha de fin debe ser posterior a la de inicio',
    path: ['endsAt'],
  })

type CommonElementFormValues = z.infer<typeof commonElementSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  elementIndex?: number
}

export const CommonElementFormDialog = ({ open, onOpenChange, elementIndex }: Props) => {
  const { getValues, setValue } = useFormContext<EventFormSchema>()
  const isEditing = elementIndex !== undefined

  const form = useForm<CommonElementFormValues>({
    resolver: zodResolver(commonElementSchema),
    defaultValues: {
      type: 'other',
    },
  })

  // Watch for external open changes to reset or populate form
  useEffect(() => {
    if (open) {
      if (isEditing) {
        const elements = getValues('agenda.commonElements')
        const element = elements?.[elementIndex]
        if (element) {
          form.reset({
            title: element.title,
            description: element.description || '',
            startsAt: element.startsAt,
            endsAt: element.endsAt,
            type: element.type as any,
          })
        }
      } else {
        form.reset({
          title: '',
          description: '',
          type: 'other',
          startsAt: undefined,
          endsAt: undefined,
        })
      }
    }
  }, [open, isEditing, elementIndex, getValues, form])

  const onSubmit = (values: CommonElementFormValues) => {
    const currentElements = getValues('agenda.commonElements') || []

    if (isEditing) {
      const updatedElements = [...currentElements]
      updatedElements[elementIndex] = {
        ...updatedElements[elementIndex],
        ...values,
      }
      setValue('agenda.commonElements', updatedElements)
    } else {
      const newElement = {
        id: uuidv4(),
        ...values,
      }
      setValue('agenda.commonElements', [...currentElements, newElement])
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Elemento Común' : 'Añadir Elemento Común'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Registro, Coffee Break..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="registration">Registro</SelectItem>
                      <SelectItem value="coffee-break">Coffee Break</SelectItem>
                      <SelectItem value="lunch">Almuerzo</SelectItem>
                      <SelectItem value="keynote">Keynote</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inicio</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Fecha inicio"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fin</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Fecha fin"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción opcional..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
