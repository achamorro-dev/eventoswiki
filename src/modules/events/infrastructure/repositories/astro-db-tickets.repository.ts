import { db, eq, Ticket } from 'astro:db'
import { v4 as uuidv4 } from 'uuid'
import type { Ticket as TicketDomain } from '../../domain/ticket'
import { TicketsRepository } from '../../domain/tickets.repository'
import { AstroTicketMapper } from '../mappers/astro-ticket.mapper'

export class AstroDBTicketsRepository implements TicketsRepository {
  async saveByEventId(eventId: string, tickets: TicketDomain[]): Promise<void> {
    await this.deleteByEventId(eventId)

    if (tickets.length > 0) {
      const ticketsToInsert = tickets.map(ticket => ({
        id: uuidv4(),
        eventId,
        ...ticket.toPrimitives(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      await db.insert(Ticket).values(ticketsToInsert)
    }
  }

  async findByEventId(eventId: string): Promise<TicketDomain[]> {
    const ticketsDto = await db.select().from(Ticket).where(eq(Ticket.eventId, eventId))
    return AstroTicketMapper.toDomainList(ticketsDto)
  }

  async deleteByEventId(eventId: string): Promise<void> {
    await db.delete(Ticket).where(eq(Ticket.eventId, eventId))
  }
}
