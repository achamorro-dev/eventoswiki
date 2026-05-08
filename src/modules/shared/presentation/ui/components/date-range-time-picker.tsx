'use client'

import { add } from 'date-fns'

import { Datetime } from '@/shared/domain/datetime/datetime'
import { useMediaQuery } from '@/ui/hooks/use-media-query'
import { Calendar as CalendarIcon } from '@/ui/icons'
import { Button } from '../button'
import { Calendar } from '../calendar'
import { cn } from '../lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { TimePicker } from './time-picker/time-picker'

interface DateRangeTimePickerProps {
  startsAt: Date | undefined
  endsAt: Date | undefined
  onStartsAtChange: (date: Date | undefined) => void
  onEndsAtChange: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
}

export function DateRangeTimePicker({
  startsAt,
  endsAt,
  onStartsAtChange,
  onEndsAtChange,
  disabled = false,
  placeholder = 'Selecciona un rango de fechas',
}: DateRangeTimePickerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const displayValue = () => {
    if (!startsAt || !endsAt) return null
    const isSameDay = Datetime.isSameDay(startsAt, endsAt)
    if (isSameDay) {
      return `${Datetime.toDateTimeString(startsAt)} - ${Datetime.toTimeString(endsAt)}`
    }
    return `${Datetime.toDateTimeString(startsAt)} - ${Datetime.toDateTimeString(endsAt)}`
  }

  const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return

    if (range.from) {
      const newFrom = preserveTime(startsAt, range.from)
      onStartsAtChange(newFrom)
    } else {
      onStartsAtChange(undefined)
    }

    if (range.to) {
      const newTo = preserveTime(endsAt, range.to)
      onEndsAtChange(newTo)
    } else if (range.from) {
      onEndsAtChange(undefined)
    } else {
      onEndsAtChange(undefined)
    }
  }

  const handleStartTimeChange = (newDate: Date | undefined) => {
    if (!startsAt) return
    onStartsAtChange(newDate)
  }

  const handleEndTimeChange = (newDate: Date | undefined) => {
    if (!endsAt) return
    onEndsAtChange(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
            !startsAt && !endsAt && 'text-muted-foreground',
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue() ?? <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Calendar
          mode="range"
          selected={{ from: startsAt, to: endsAt }}
          defaultMonth={startsAt}
          onSelect={handleRangeSelect}
          numberOfMonths={isDesktop ? 2 : 1}
        />
        <div className="grid grid-cols-2 gap-4 border-border border-t p-3">
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground text-xs">Hora de inicio</p>
            <TimePicker date={startsAt} setDate={handleStartTimeChange} showIcon={false} />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground text-xs">Hora de fin</p>
            <TimePicker date={endsAt} setDate={handleEndTimeChange} showIcon={false} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function preserveTime(currentDate: Date | undefined, newDay: Date): Date {
  if (!currentDate) return newDay
  const diff = newDay.getTime() - currentDate.getTime()
  const diffInDays = diff / (1000 * 60 * 60 * 24)
  return add(currentDate, { days: Math.ceil(diffInDays) })
}
