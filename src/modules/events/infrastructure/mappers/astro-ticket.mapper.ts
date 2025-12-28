import { Ticket } from '../../domain/ticket'
import type { AstroDbTicketDto } from '../dtos/astro-db-event.dto'

export class AstroTicketMapper {
  static toDomainList(dtos: AstroDbTicketDto[]): Ticket[] {
    return dtos.map(dto => AstroTicketMapper.toDomain(dto))
  }

  static toDomain(dto: AstroDbTicketDto): Ticket {
    return Ticket.fromPrimitives({
      name: dto.name,
      price: dto.price,
    })
  }
}
