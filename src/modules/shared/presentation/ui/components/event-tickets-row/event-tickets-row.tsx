import type { FC } from 'react'
import { PiTicket } from 'react-icons/pi'
import type { TicketPrimitives } from '@/events/domain/ticket'
import { EventDataRow } from '../event-data-row/event-data-row'

interface Props {
  tickets: TicketPrimitives[]
}

const formatPrice = (price: number): string => {
  if (price === 0) {
    return 'Gratis'
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export const EventTicketsRow: FC<Props> = ({ tickets }) => {
  if (tickets.length === 0) {
    return null
  }

  return (
    <EventDataRow
      title="Entradas"
      icon={<PiTicket />}
      value={
        <div className="flex flex-col gap-1">
          {tickets.map(ticket => (
            <div key={ticket.name} className="font-medium text-foreground text-sm">
              <span>{ticket.name}</span>
              <span className="text-muted-foreground"> • {formatPrice(ticket.price)}</span>
            </div>
          ))}
        </div>
      }
      ariaLabel="Entradas disponibles"
    />
  )
}
