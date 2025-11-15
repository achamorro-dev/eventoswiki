import type { FC } from 'react'
import { Broadcast } from '@/ui/icons'
import { EventDataRow } from '../event-data-row/event-data-row'

interface Props {
  streamingUrl?: string
  shouldShowLink?: boolean
}

export const EventStreaming: FC<Props> = ({ streamingUrl, shouldShowLink = true }) => {
  return (
    streamingUrl && (
      <EventDataRow
        title="Streaming"
        icon={<Broadcast />}
        value={
          shouldShowLink ? (
            <a
              href={streamingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm font-medium hover:underline"
            >
              {streamingUrl}
            </a>
          ) : (
            'Debes registrarte en el evento para ver el enlace.'
          )
        }
        ariaLabel={`URL de streaming del evento: ${streamingUrl}`}
      />
    )
  )
}
