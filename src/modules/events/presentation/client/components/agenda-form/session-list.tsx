import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Pencil, Plus, Trash } from '@/ui/icons'
import type { EventFormSchema } from '../event-edit-form/event-form-schema'
import { SessionFormDialog } from './session-form-dialog'

interface Props {
  trackIndex: number
}

export const SessionList = ({ trackIndex }: Props) => {
  const { control } = useFormContext<EventFormSchema>()
  const { fields, remove } = useFieldArray({
    control,
    name: `agenda.tracks.${trackIndex}.sessions`,
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Sesiones</h3>
        <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Sesión
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{field.title}</span>
              <div className="text-gray-500 text-xs">
                {Datetime.toDateTimeHuman(field.startsAt)} - {Datetime.toDateTimeHuman(field.endsAt)}
              </div>
              {field.speakers && field.speakers.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {field.speakers.map((speaker: any) => (
                    <Badge key={speaker.id} variant="secondary" className="h-5 px-1 py-0 text-[10px]">
                      {speaker.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingIndex(index)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}>
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="rounded-md border border-dashed py-4 text-center text-gray-500 text-xs">
          No hay sesiones en este track.
        </div>
      )}

      {(isDialogOpen || editingIndex !== null) && (
        <SessionFormDialog
          open={isDialogOpen || editingIndex !== null}
          onOpenChange={open => {
            setIsDialogOpen(open)
            if (!open) setEditingIndex(null)
          }}
          trackIndex={trackIndex}
          sessionIndex={editingIndex !== null ? editingIndex : undefined}
        />
      )}
    </div>
  )
}
