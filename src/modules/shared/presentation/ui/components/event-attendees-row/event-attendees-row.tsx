import type { FC } from 'react'
import { Users } from '@/shared/presentation/ui/icons'
import { AvatarStack } from '../avatar-stack/avatar-stack'
import { EventDataRow } from '../event-data-row/event-data-row'

interface Attendee {
  name: string
  avatar?: string | null
}

interface Props {
  attendees: Attendee[]
}

export const EventAttendeesRow: FC<Props> = ({ attendees }) => {
  if (attendees.length === 0) {
    return null
  }

  return (
    <EventDataRow
      title="Asistentes"
      icon={<Users />}
      value={<AvatarStack attendees={attendees} />}
      ariaLabel={`Asistentes del evento: ${attendees.length} personas`}
    />
  )
}
