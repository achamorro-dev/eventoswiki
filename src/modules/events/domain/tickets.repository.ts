import type { Ticket } from './ticket'

export abstract class TicketsRepository {
  abstract saveByEventId(eventId: string, tickets: Ticket[]): Promise<void>
  abstract findByEventId(eventId: string): Promise<Ticket[]>
  abstract deleteByEventId(eventId: string): Promise<void>
}
