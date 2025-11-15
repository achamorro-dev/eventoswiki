'use client'

import { Clock } from 'lucide-react'
import * as React from 'react'
import { Label } from '@/ui/label'
import { TimePickerInput } from './time-picker-input'

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  hoursLabel?: string
  minutesLabel?: string
  secondsLabel?: string
  showSeconds?: boolean
}

export function TimePicker(props: TimePickerProps) {
  const {
    date,
    setDate,
    hoursLabel = 'Horas',
    minutesLabel = 'Minutos',
    secondsLabel = 'Segundos',
    showSeconds = false,
  } = props
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-end gap-2">
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="justify-center text-xs">
          {hoursLabel}
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="justify-center text-xs">
          {minutesLabel}
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      {showSeconds && (
        <div className="grid gap-1 text-center">
          <Label htmlFor="seconds" className="justify-center text-xs">
            {secondsLabel}
          </Label>
          <TimePickerInput
            picker="seconds"
            date={date}
            setDate={setDate}
            ref={secondRef}
            onLeftFocus={() => minuteRef.current?.focus()}
          />
        </div>
      )}
    </div>
  )
}
