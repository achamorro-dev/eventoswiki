import { MapPinLine } from '@/ui/icons'
import type { FC } from 'react'
import { EventDataRow } from '../event-data-row/event-data-row'

interface Props {
  location: string | null
}

export const EventLocation: FC<Props> = ({ location }) => {
  return (
    location && (
      <EventDataRow
        title="Localización"
        icon={<MapPinLine />}
        value={location}
        ariaLabel={`Localización del evento: ${location}`}
      />
    )
  )
}
