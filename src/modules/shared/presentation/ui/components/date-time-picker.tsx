'use client'

import { add } from 'date-fns'

import { Datetime } from '@/shared/domain/datetime/datetime'
import { Calendar as CalendarIcon } from '@/ui/icons'
import { Button } from '../button'
import { Calendar } from '../calendar'
import { cn } from '../lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { TimePicker } from './time-picker/time-picker'

interface DateTimePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  disabled: boolean
  placeholder?: string
  format?: (value: Date) => string
}
export function DateTimePicker(props: DateTimePickerProps) {
  const {
    value,
    onChange,
    disabled,
    placeholder = 'Selecciona una fecha',
    format = Datetime.toDateTimeString,
    ...rest
  } = props
  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return
    if (!value) {
      onChange(newDay)
      return
    }
    const diff = newDay.getTime() - value.getTime()
    const diffInDays = diff / (1000 * 60 * 60 * 24)
    const newDateFull = add(value, { days: Math.ceil(diffInDays) })
    onChange(newDateFull)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            !value && 'text-muted-foreground',
          )}
          disabled={disabled}
          {...rest}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(d: Date | undefined) => handleSelect(d)}
          initialFocus
        />
        <div className="border-border border-t p-3">
          <TimePicker setDate={onChange} date={value} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
