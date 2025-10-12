import { Datetime } from '@/shared/domain/datetime/datetime'
import { Badge } from '@/ui/badge'
import { Card, CardContent } from '@/ui/card'
import { cn } from '@/ui/lib/utils'
import { useNavigate } from 'astro:transitions/client'
import { Calendar, MapPin } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    slug: string
    title: string
    shortDescription: string
    image: string
    tags: string[]
    tagColor: string
    startsAt: Date
    endsAt: Date
    location?: string | null
  }
  className?: string
}

export const EventCard = ({ event, className }: EventCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/events/${event.slug}`)
  }

  const formatTime = (date: Date) => {
    return Datetime.toTimeString(date)
  }

  const formatDate = (date: Date) => {
    return Datetime.toDateString(date)
  }

  const isSameDay = () => {
    return Datetime.toDateIsoString(event.startsAt) === Datetime.toDateIsoString(event.endsAt)
  }

  return (
    <Card
      className={cn('cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg', className)}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            className="h-32 w-full rounded-t-xl object-cover"
            src={event.image}
            alt={`Foto de portada del evento ${event.title}`}
            loading="lazy"
            onError={e => {
              const target = e.target as HTMLImageElement
              target.src = '/not-found.jpg'
            }}
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {event.tags.map((tag, index) => (
              <Badge key={index} color={event.tagColor} className="text-xs text-white">
                {tag.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="text-foreground line-clamp-2 text-lg font-semibold">{event.title}</h3>

          {event.shortDescription && (
            <p className="text-muted-foreground line-clamp-2 text-sm">{event.shortDescription}</p>
          )}

          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {isSameDay()
                  ? `${formatDate(event.startsAt)} - ${formatTime(event.startsAt)} - ${formatTime(event.endsAt)}`
                  : `${formatDate(event.startsAt)} - ${formatDate(event.endsAt)}`}
              </span>
            </div>

            {event.location && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
