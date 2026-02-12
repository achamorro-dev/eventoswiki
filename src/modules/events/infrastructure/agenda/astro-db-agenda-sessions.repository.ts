import { AgendaSession, AgendaSessionSpeaker, asc, db, eq } from 'astro:db'
import type { AgendaSessionsRepository } from '../../domain/agenda/agenda-sessions.repository'
import type { AgendaSpeakersRepository } from '../../domain/agenda/agenda-speakers.repository'
import { Session } from '../../domain/agenda/session'
import { AstroDbAgendaSessionMapper } from './mappers/astro-db-agenda-session.mapper'

export class AstroDbAgendaSessionsRepository implements AgendaSessionsRepository {
  constructor(private readonly speakersRepository: AgendaSpeakersRepository) {}

  async saveByTrackId(trackId: string, sessions: Session[]): Promise<void> {
    await this.deleteByTrackId(trackId)

    if (sessions.length > 0) {
      for (const session of sessions) {
        const sessionDto = AstroDbAgendaSessionMapper.toDto(session, trackId)
        await db.insert(AgendaSession).values(sessionDto)

        // Guardar speakers de la sesión
        await this.speakersRepository.saveBySessionId(session.getId(), session.getSpeakers())
      }
    }
  }

  async findByTrackId(trackId: string): Promise<Session[]> {
    const sessionsDto = await db
      .select()
      .from(AgendaSession)
      .where(eq(AgendaSession.trackId, trackId))
      .orderBy(asc(AgendaSession.order))

    const sessions = await Promise.all(
      sessionsDto.map(async sessionDto => {
        const speakers = await this.speakersRepository.findBySessionId(sessionDto.id)
        return AstroDbAgendaSessionMapper.toDomain(
          sessionDto,
          speakers.map(s => s.toPrimitives()),
        )
      }),
    )

    return sessions
  }

  async deleteByTrackId(trackId: string): Promise<void> {
    const sessions = await db
      .select({ id: AgendaSession.id })
      .from(AgendaSession)
      .where(eq(AgendaSession.trackId, trackId))

    // Eliminar relaciones session-speakers primero
    for (const session of sessions) {
      await db.delete(AgendaSessionSpeaker).where(eq(AgendaSessionSpeaker.sessionId, session.id))
    }

    await db.delete(AgendaSession).where(eq(AgendaSession.trackId, trackId))
  }
}
