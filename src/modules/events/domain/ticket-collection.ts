import { Ticket, type TicketPrimitives } from './ticket'

export class TicketCollection {
  private tickets: Ticket[]

  constructor(tickets: Ticket[] = []) {
    this.tickets = tickets
  }

  static fromPrimitives(primitives: TicketPrimitives[] = []): TicketCollection {
    const tickets = primitives.map(p => Ticket.fromPrimitives(p))
    return new TicketCollection(tickets)
  }

  toPrimitives(): TicketPrimitives[] {
    return this.tickets.map(t => t.toPrimitives())
  }

  getTickets(): Ticket[] {
    return [...this.tickets]
  }

  addTicket(ticket: Ticket): void {
    this.tickets.push(ticket)
  }

  removeTicket(index: number): void {
    if (index >= 0 && index < this.tickets.length) {
      this.tickets.splice(index, 1)
    }
  }

  updateTicket(index: number, ticket: Ticket): void {
    if (index >= 0 && index < this.tickets.length) {
      this.tickets[index] = ticket
    }
  }

  isEmpty(): boolean {
    return this.tickets.length === 0
  }

  count(): number {
    return this.tickets.length
  }

  hasTickets(): boolean {
    return this.tickets.length > 0
  }

  getMinPrice(): number | null {
    if (this.tickets.length === 0) {
      return null
    }
    return Math.min(...this.tickets.map(t => t.getPrice()))
  }
}
