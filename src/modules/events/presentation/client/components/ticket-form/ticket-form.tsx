'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { XBold } from '@/ui/icons'
import { Input } from '@/ui/input'
import type { EventFormSchema } from '../event-edit-form/event-form-schema'

export const TicketForm = () => {
  const { control } = useFormContext<EventFormSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tickets',
  })

  const handleAddTicket = () => {
    append({ name: '', price: 0 })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Tipos de Entrada</h3>
        <p className="text-gray-500 text-sm">Opcional - Configura diferentes tipos de entradas con sus precios</p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-3 rounded-lg border border-gray-200 p-4">
            <FormField
              control={control}
              name={`tickets.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm">Nombre de la entrada</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Entrada General" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`tickets.${index}.price`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm">Precio (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 15.99"
                      step="0.01"
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <XBold className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={handleAddTicket} className="w-full">
        + Agregar tipo de entrada
      </Button>
    </div>
  )
}
