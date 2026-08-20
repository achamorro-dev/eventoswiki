import { Datetime } from '@/shared/domain/datetime/datetime'
import { Card, CardContent } from '@/ui/card'
import { cn } from '@/ui/lib/utils'
import './big-calendar.css'
import type { CalendarEvent } from './calendar-event'

interface EventCardProps {
  event: CalendarEvent
  displayDate: Date
  className?: string
}

export const EventCard = ({ event, displayDate, className }: EventCardProps) => {
  const formatTime = (date: Date) => {
    return Datetime.toTimeString(date)
  }

  const formatDate = (date: Date) => {
    return Datetime.toDateString(date)
  }

  const isSameDay = () => {
    return Datetime.toDateIsoString(event.start) === Datetime.toDateIsoString(event.end)
  }

  const isStartDate = () => {
    return Datetime.toDateIsoString(displayDate) === Datetime.toDateIsoString(event.start)
  }

  const isEndDate = () => {
    return Datetime.toDateIsoString(displayDate) === Datetime.toDateIsoString(event.end)
  }

  const getTimeDisplay = () => {
    if (isSameDay()) {
      return `${formatTime(event.start)} - ${formatTime(event.end)}`
    }

    if (isStartDate()) {
      return formatTime(event.start)
    }

    if (isEndDate()) {
      return formatTime(event.end)
    }

    return formatDate(event.end)
  }

  return (
    <a href={event.url} target="_blank">
      <Card
        className={cn(
          'event-card cursor-pointer border border-border py-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
          event.isMeetup && 'meetup-event',
          className,
        )}
      >
        <CardContent className="px-4">
          <h3 className="font-medium text-lg">{event.title}</h3>

          <div className="flex items-center gap-2 font-light text-sm">
            <span>{getTimeDisplay()}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
