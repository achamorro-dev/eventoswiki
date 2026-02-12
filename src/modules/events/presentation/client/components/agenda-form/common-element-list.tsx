import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Pencil, Trash } from '@/ui/icons'
import type { EventFormSchema } from '../event-edit-form/event-form-schema'
import { CommonElementFormDialog } from './common-element-form-dialog'

export const CommonElementList = () => {
  const { control } = useFormContext<EventFormSchema>()
  const { fields, remove } = useFieldArray({
    control,
    name: 'agenda.commonElements',
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CardTitle className="font-medium text-base">{field.title}</CardTitle>
                <Badge variant="outline">{field.type}</Badge>
              </div>
              <div className="text-gray-500 text-sm">
                {Datetime.toDateTimeHuman(field.startsAt)} - {Datetime.toDateTimeHuman(field.endsAt)}
              </div>
            </div>
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
        </Card>
      ))}

      {fields.length === 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">No hay elementos comunes definidos.</div>
      )}

      {editingIndex !== null && (
        <CommonElementFormDialog
          open={true}
          onOpenChange={open => !open && setEditingIndex(null)}
          elementIndex={editingIndex}
        />
      )}
    </div>
  )
}
