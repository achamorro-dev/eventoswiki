import { Datetime } from '@/shared/domain/datetime/datetime'
import { Calendar } from '@/ui/calendar'
import { cn } from '@/ui/lib/utils'
import { navigate } from 'astro:transitions/client'
import { useMemo } from 'react'
import { type CalendarEvent } from './calendar-event'
import { EventCard } from './event-card'

interface Props {
  events: CalendarEvent[]
  selectedDate?: Date
  className?: string
}

export const Agenda = (props: Props) => {
  const { events, selectedDate, className } = props

  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {}

    events.forEach(event => {
      const dateKey = Datetime.toDateIsoString(event.start)
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })

    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => a.start.getTime() - b.start.getTime())
    })

    return grouped
  }, [events])

  const sortedDates = useMemo(() => {
    return Object.keys(eventsByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  }, [eventsByDate])

  const datesWithEvents = useMemo(() => {
    return sortedDates.map(date => new Date(date))
  }, [sortedDates])

  const onSelectDate = (date: Date | undefined) => {
    if (!date) return

    const url = new URL(window.location.href)
    url.searchParams.set('date', Datetime.toDateIsoString(date))

    navigate(encodeURI(url.toString()))
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Calendar
          mode="single"
          month={selectedDate}
          onMonthChange={onSelectDate}
          onSelect={undefined}
          onDayClick={onSelectDate}
          className="mx-auto w-full px-0"
          modifiers={{
            hasEvents: datesWithEvents,
          }}
          modifiersClassNames={{
            hasEvents: 'agenda-day-with-events',
          }}
        />

        <div className="space-y-4">
          <div className="space-y-6">
            {sortedDates.map(dateKey => {
              const date = new Date(dateKey)
              const dayEvents = eventsByDate[dateKey]

              return (
                <div key={dateKey} className="space-y-3">
                  <h3 className="text-foreground text-lg font-medium">{Datetime.toDayString(date)}</h3>
                  <ul className="space-y-3">
                    {dayEvents.map(event => (
                      <li key={event.id}>
                        <EventCard event={event} displayDate={date} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
