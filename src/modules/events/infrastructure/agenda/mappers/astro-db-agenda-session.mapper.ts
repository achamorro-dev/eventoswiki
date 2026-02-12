import { Session } from '../../../domain/agenda/session'
import type { AstroDbAgendaSessionDto } from './astro-db-agenda-session.dto'

export class AstroDbAgendaSessionMapper {
  static toDomain(dto: AstroDbAgendaSessionDto, speakers: any[] = []): Session {
    return Session.fromPrimitives({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      image: dto.image ?? undefined,
      categories: dto.categories ? JSON.parse(dto.categories) : undefined,
      language: dto.language ?? undefined,
      startsAt: dto.startsAt.toISOString(),
      endsAt: dto.endsAt.toISOString(),
      speakers,
    })
  }

  static toDto(session: Session, trackId: string): AstroDbAgendaSessionDto {
    return {
      id: session.getId(),
      trackId,
      title: session.getTitle(),
      description: session.getDescription(),
      image: session.getImage() ?? null,
      categories: session.getCategories() ? JSON.stringify(session.getCategories()) : null,
      language: session.getLanguage() ?? null,
      startsAt: session.getStartsAt(),
      endsAt: session.getEndsAt(),
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}
