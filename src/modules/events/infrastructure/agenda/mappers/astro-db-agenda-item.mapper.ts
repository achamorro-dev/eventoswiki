import { CommonElement } from '../../../domain/agenda/common-element'
import type { AstroDbAgendaItemDto } from './astro-db-agenda-item.dto'

export class AstroDbAgendaItemMapper {
  static toDomain(dto: AstroDbAgendaItemDto): CommonElement {
    return CommonElement.fromPrimitives({
      id: dto.id,
      title: dto.title,
      description: dto.description ?? undefined,
      startsAt: dto.startsAt.toISOString(),
      endsAt: dto.endsAt.toISOString(),
      type: dto.type as any,
    })
  }

  static toDto(element: CommonElement, eventId: string): AstroDbAgendaItemDto {
    return {
      id: element.getId(),
      eventId,
      type: element.getType(),
      title: element.getTitle(),
      description: element.getDescription() ?? null,
      startsAt: element.getStartsAt(),
      endsAt: element.getEndsAt(),
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}
