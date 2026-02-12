import { Track } from '../../../domain/agenda/track'
import type { AstroDbAgendaTrackDto } from './astro-db-agenda-track.dto'

export class AstroDbAgendaTrackMapper {
  static toDomain(dto: AstroDbAgendaTrackDto, sessions: any[] = []): Track {
    return Track.fromPrimitives({
      id: dto.id,
      name: dto.name,
      description: dto.description ?? undefined,
      sessions,
    })
  }

  static toDto(track: Track, eventId: string): AstroDbAgendaTrackDto {
    return {
      id: track.getId(),
      eventId,
      name: track.getName(),
      description: track.getDescription() ?? null,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}
