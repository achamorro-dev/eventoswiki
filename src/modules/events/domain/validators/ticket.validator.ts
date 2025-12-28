import { Ticket } from '../ticket'

export class TicketValidator {
  constructor(private readonly data: { name: string; price: number }) {}

  validate(): string | null {
    try {
      Ticket.create(this.data)
      return null
    } catch (error) {
      if (error instanceof Error) {
        return error.message
      }
      return 'Error desconocido al validar el ticket'
    }
  }
}
