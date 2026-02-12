import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Pencil, Trash } from '@/ui/icons'
import type { EventFormSchema } from '../event-edit-form/event-form-schema'
import { SessionList } from './session-list'
import { TrackFormDialog } from './track-form-dialog'

export const TrackList = () => {
  const { control } = useFormContext<EventFormSchema>()
  const { fields, remove } = useFieldArray({
    control,
    name: 'agenda.tracks',
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="font-medium text-base">{field.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setEditingIndex(index)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {field.description && (
            <CardContent className="p-4 pt-0 text-gray-500 text-sm">{field.description}</CardContent>
          )}
          <CardContent className="p-4 pt-0">
            <SessionList trackIndex={index} />
          </CardContent>
        </Card>
      ))}

      {fields.length === 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">No hay tracks definidos. Añade uno para empezar.</div>
      )}

      {editingIndex !== null && (
        <TrackFormDialog open={true} onOpenChange={open => !open && setEditingIndex(null)} trackIndex={editingIndex} />
      )}
    </div>
  )
}
