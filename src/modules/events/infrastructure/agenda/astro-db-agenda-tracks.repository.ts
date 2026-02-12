import { AgendaTrack, asc, db, eq } from 'astro:db'
import type { AgendaSessionsRepository } from '../../domain/agenda/agenda-sessions.repository'
import type { AgendaTracksRepository } from '../../domain/agenda/agenda-tracks.repository'
import { Track } from '../../domain/agenda/track'
import { AstroDbAgendaTrackMapper } from './mappers/astro-db-agenda-track.mapper'

export class AstroDbAgendaTracksRepository implements AgendaTracksRepository {
  constructor(private readonly sessionsRepository: AgendaSessionsRepository) {}

  async saveByEventId(eventId: string, tracks: Track[]): Promise<void> {
    await this.deleteByEventId(eventId)

    if (tracks.length > 0) {
      const tracksToInsert = tracks.map(track => AstroDbAgendaTrackMapper.toDto(track, eventId))
      await db.insert(AgendaTrack).values(tracksToInsert)

      // Guardar sesiones de cada track
      for (const track of tracks) {
        await this.sessionsRepository.saveByTrackId(track.getId(), track.getSessions())
      }
    }
  }

  async findByEventId(eventId: string): Promise<Track[]> {
    const tracksDto = await db
      .select()
      .from(AgendaTrack)
      .where(eq(AgendaTrack.eventId, eventId))
      .orderBy(asc(AgendaTrack.order))

    const tracks = await Promise.all(
      tracksDto.map(async trackDto => {
        const sessions = await this.sessionsRepository.findByTrackId(trackDto.id)
        return AstroDbAgendaTrackMapper.toDomain(
          trackDto,
          sessions.map(s => s.toPrimitives()),
        )
      }),
    )

    return tracks
  }

  async deleteByEventId(eventId: string): Promise<void> {
    const tracks = await db.select({ id: AgendaTrack.id }).from(AgendaTrack).where(eq(AgendaTrack.eventId, eventId))

    // Eliminar sesiones primero (cascade)
    for (const track of tracks) {
      await this.sessionsRepository.deleteByTrackId(track.id)
    }

    await db.delete(AgendaTrack).where(eq(AgendaTrack.eventId, eventId))
  }
}
