import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'

interface Attendee {
  name: string
  avatar?: string | null
}

interface Props {
  attendees: Attendee[]
  maxVisible?: number
}

export const AvatarStack = ({ attendees, maxVisible = 5 }: Props) => {
  if (attendees.length === 0) {
    return null
  }

  const visibleAttendees = attendees.slice(0, maxVisible)
  const remainingCount = Math.max(0, attendees.length - maxVisible)

  return (
    <div className="-space-x-2 flex items-center">
      {visibleAttendees.map((attendee, index) => (
        <div key={`${attendee.name}-${index}`} className="relative" title={attendee.name}>
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarImage src={attendee.avatar ?? undefined} alt={attendee.name} />
            <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted font-medium text-mutedforeground text-xs"
          title={`+${remainingCount} más`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
