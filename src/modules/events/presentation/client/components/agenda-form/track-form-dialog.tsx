import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'astro/zod'
import { useEffect } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import type { EventFormSchema } from '../event-edit-form/event-form-schema'

const trackSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
})

type TrackFormValues = z.infer<typeof trackSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackIndex?: number
}

export const TrackFormDialog = ({ open, onOpenChange, trackIndex }: Props) => {
  const { getValues, setValue } = useFormContext<EventFormSchema>()
  const isEditing = trackIndex !== undefined

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // Watch for external open changes to reset or populate form
  useEffect(() => {
    if (open) {
      if (isEditing) {
        const tracks = getValues('agenda.tracks')
        const track = tracks?.[trackIndex]
        if (track) {
          form.reset({
            name: track.name,
            description: track.description || '',
          })
        }
      } else {
        form.reset({
          name: '',
          description: '',
        })
      }
    }
  }, [open, isEditing, trackIndex, getValues, form])

  const onSubmit = (values: TrackFormValues) => {
    const currentTracks = getValues('agenda.tracks') || []

    if (isEditing) {
      const updatedTracks = [...currentTracks]
      updatedTracks[trackIndex] = {
        ...updatedTracks[trackIndex],
        ...values,
      }
      setValue('agenda.tracks', updatedTracks)
    } else {
      const newTrack = {
        id: uuidv4(),
        ...values,
        sessions: [], // Initialize sessions as empty array
      }
      setValue('agenda.tracks', [...currentTracks, newTrack])
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Track' : 'Añadir Track'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Sala A, Track Principal..." {...field} />
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
                    <Textarea placeholder="Descripción opcional del track" {...field} />
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
