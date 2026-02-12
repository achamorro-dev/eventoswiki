import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'astro/zod'
import { useEffect } from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/ui/button'
import { DateTimePicker } from '@/ui/components/date-time-picker'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Plus, Trash } from '@/ui/icons'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import type { EventFormSchema } from '../event-edit-form/event-form-schema'

const speakerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  bio: z.string().optional(),
  position: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      web: z.string().optional(),
    })
    .optional(),
})

const sessionSchema = z
  .object({
    title: z.string().min(1, 'El título es obligatorio'),
    description: z.string().optional(), // Made optional in form for easier editing, though schema says required? Let's check. Schema says required.
    startsAt: z.date({ required_error: 'La fecha de inicio es obligatoria' }),
    endsAt: z.date({ required_error: 'La fecha de fin es obligatoria' }),
    speakers: z.array(speakerSchema).default([]),
  })
  .refine(data => data.endsAt > data.startsAt, {
    message: 'La fecha de fin debe ser posterior a la de inicio',
    path: ['endsAt'],
  })

type SessionFormValues = z.infer<typeof sessionSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackIndex: number
  sessionIndex?: number
}

export const SessionFormDialog = ({ open, onOpenChange, trackIndex, sessionIndex }: Props) => {
  const { getValues, setValue } = useFormContext<EventFormSchema>()
  const isEditing = sessionIndex !== undefined

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema) as any,
    defaultValues: {
      speakers: [],
    },
  })

  // Speakers field array
  const {
    fields: speakerFields,
    append: appendSpeaker,
    remove: removeSpeaker,
  } = useFieldArray({
    control: form.control,
    name: 'speakers',
  })

  // Watch for external open changes to reset or populate form
  useEffect(() => {
    if (open) {
      if (isEditing) {
        const tracks = getValues('agenda.tracks')
        const session = tracks?.[trackIndex]?.sessions?.[sessionIndex]
        if (session) {
          form.reset({
            title: session.title,
            description: session.description,
            startsAt: session.startsAt,
            endsAt: session.endsAt,
            speakers: session.speakers || [],
          })
        }
      } else {
        form.reset({
          title: '',
          description: '', // description is required in schema but let's default to empty string
          startsAt: undefined,
          endsAt: undefined,
          speakers: [],
        })
      }
    }
  }, [open, isEditing, trackIndex, sessionIndex, getValues, form])

  const onSubmit = (values: SessionFormValues) => {
    const currentTracks = getValues('agenda.tracks') || []
    const currentSessions = currentTracks[trackIndex].sessions || []

    if (isEditing) {
      const updatedSessions = [...currentSessions]
      updatedSessions[sessionIndex] = {
        ...updatedSessions[sessionIndex],
        ...values,
        description: values.description || '', // Ensure string
      }

      const updatedTracks = [...currentTracks]
      updatedTracks[trackIndex] = {
        ...updatedTracks[trackIndex],
        sessions: updatedSessions,
      }
      setValue('agenda.tracks', updatedTracks)
    } else {
      const newSession = {
        id: uuidv4(),
        ...values,
        description: values.description || '',
        image: undefined, // Optional fields
        categories: [],
        language: undefined,
      }

      const updatedTracks = [...currentTracks]
      if (!updatedTracks[trackIndex].sessions) {
        updatedTracks[trackIndex].sessions = []
      }
      updatedTracks[trackIndex].sessions.push(newSession)
      setValue('agenda.tracks', updatedTracks)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Sesión' : 'Añadir Sesión'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4 overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la sesión" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Descripción de la sesión..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold text-sm">Speakers</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSpeaker({ id: uuidv4(), name: '', bio: '', position: '', socialLinks: {} })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Añadir Speaker
                </Button>
              </div>

              <div className="space-y-4">
                {speakerFields.map((field, index) => (
                  <div key={field.id} className="group relative space-y-3 rounded-md border p-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removeSpeaker(index)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`speakers.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del speaker" {...field} className="h-8 text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`speakers.${index}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Cargo/Rol</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Senior Engineer" {...field} className="h-8 text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`speakers.${index}.bio`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Bio</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Pequeña biografía" {...field} className="min-h-[60px] text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                {speakerFields.length === 0 && (
                  <div className="text-center text-gray-400 text-sm italic">No hay speakers añadidos.</div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4">
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
