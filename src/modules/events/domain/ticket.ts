import { ValueObject } from '@/shared/domain/value-object'

export interface TicketProps {
  name: string
  price: number
}

export type TicketPrimitives = {
  name: string
  price: number
}

export class Ticket extends ValueObject<TicketProps> {
  constructor(value: TicketProps) {
    Ticket.ensureIsValid(value)
    super(value)
  }

  static fromPrimitives(primitives: TicketPrimitives): Ticket {
    return new Ticket({
      name: primitives.name,
      price: primitives.price,
    })
  }

  toPrimitives(): TicketPrimitives {
    return {
      name: this.value.name,
      price: this.value.price,
    }
  }

  static create(data: { name: string; price: number }): Ticket {
    return new Ticket({
      name: data.name,
      price: data.price,
    })
  }

  private static ensureIsValid(data: TicketProps): void {
    const { name, price } = data

    if (typeof name !== 'string' || name.trim().length < 3) {
      throw new Error('El nombre del ticket debe tener al menos 3 caracteres')
    }

    if (typeof price !== 'number' || price < 0) {
      throw new Error('El precio del ticket debe ser un número no negativo')
    }

    // Validar que el precio tiene máximo 2 decimales
    if (!Number.isFinite(price) || Math.round(price * 100) / 100 !== price) {
      throw new Error('El precio del ticket debe tener máximo 2 decimales')
    }
  }

  getName(): string {
    return this.value.name
  }

  getPrice(): number {
    return this.value.price
  }

  isFree(): boolean {
    return this.value.price === 0
  }
}
