import { navigate } from 'astro:transitions/client'
import moment from 'moment'
import type { CSSProperties, FC } from 'react'
import { useMemo, useRef } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import { cn } from '@/ui/lib/utils'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Datetime } from '../../../../domain/datetime/datetime'
import './big-calendar.css'
import type { CalendarEvent } from './calendar-event'

moment.locale('es', {
  week: {
    dow: 1,
  },
})

const localizer = momentLocalizer(moment)

type BigCalendarProps = {
  events: CalendarEvent[]
  selectedDate?: Date
  className?: string
}

interface CustomCSS extends CSSProperties {
  '--event-background-color': string
  '--event-border-color': string
  '--event-color': string
}

const allViews = [Views.MONTH]

export const BigCalendar: FC<BigCalendarProps> = ({ events, selectedDate, className }) => {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const formats = useMemo(
    () => ({
      dayFormat: Datetime.toDayString,
      dateFormat: Datetime.toDayNumberString,
      agendaDateFormat: Datetime.toDayString,
      monthHeaderFormat: Datetime.toMonthYearString,
      weekdayFormat: Datetime.toWeekdayString,
      dayRangeHeaderFormat: (range: { start: Date; end: Date }) => Datetime.toDateRangeString(range.start, range.end),
      agendaHeaderFormat: (range: { start: Date; end: Date }) => Datetime.toDateRangeString(range.start, range.end),
    }),
    [],
  )

  const onSelectEvent = (event: CalendarEvent) => {
    linkRef.current!.href = event.url
    linkRef.current!.click()
  }

  const onDateChange = (date: Date) => {
    const url = new URL(window.location.href)
    url.searchParams.set('date', Datetime.toDateIsoString(date))

    navigate(encodeURI(url.toString()))
  }

  return (
    <section className={cn('calendar-wrapper', className)}>
      <Calendar
        className="big-calendar"
        localizer={localizer}
        events={events}
        views={allViews}
        formats={formats}
        date={selectedDate}
        popup
        messages={{
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          allDay: 'Todo el día',
          week: 'Semana',
          work_week: 'Semana de trabajo',
          day: 'Día',
          month: 'Mes',
          previous: 'Anterior',
          next: 'Siguiente',
          yesterday: 'Ayer',
          tomorrow: 'Mañana',
          today: 'Hoy',
          agenda: 'Agenda',
          noEventsInRange: 'No hay eventos dentro del rango de fechas',
          showMore: e => `+${e} más`,
        }}
        eventPropGetter={event => ({
          className: 'event',
          style: {
            '--event-background-color': event.color,
            '--event-border-color': event.color,
            '--event-color': event.color,
          } as CustomCSS,
        })}
        onSelectEvent={onSelectEvent}
        onNavigate={onDateChange}
      />
      <a ref={linkRef} target="_blank" aria-hidden />
    </section>
  )
}
