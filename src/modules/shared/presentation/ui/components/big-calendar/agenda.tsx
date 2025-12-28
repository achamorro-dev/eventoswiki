import { navigate } from 'astro:transitions/client'
import { useMemo } from 'react'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { Calendar } from '@/ui/calendar'
import { cn } from '@/ui/lib/utils'
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

  const generateDateId = (isoDateString: string): string => {
    // Convierte "2024-01-15" a "date-20240115"
    return `date-${isoDateString.replace(/-/g, '')}`
  }

  const handleDayClick = (date: Date | undefined) => {
    if (!date) return

    const isoDateString = Datetime.toDateIsoString(date)
    const elementId = generateDateId(isoDateString)
    const element = document.getElementById(elementId)

    if (element) {
      // Scroll suave con margen para el header (aproximadamente 100px)
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  const onMonthChange = (date: Date | undefined) => {
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
          onMonthChange={onMonthChange}
          onSelect={undefined}
          onDayClick={handleDayClick}
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
              const now = new Date()
              const isToday = Datetime.isSameDay(date, now)
              const dateId = generateDateId(dateKey)

              return (
                <div key={dateId} id={dateId} className="space-y-3">
                  <h3 className={cn('font-medium text-lg', isToday ? 'text-primary' : 'text-foreground')}>
                    {Datetime.toDayString(date)}
                  </h3>
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
