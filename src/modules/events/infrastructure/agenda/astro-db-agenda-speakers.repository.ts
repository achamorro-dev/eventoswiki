import { AgendaSessionSpeaker, AgendaSpeaker, db, eq } from 'astro:db'
import type { AgendaSpeakersRepository } from '../../domain/agenda/agenda-speakers.repository'
import { Speaker } from '../../domain/agenda/speaker'
import { AstroDbAgendaSpeakerMapper } from './mappers/astro-db-agenda-speaker.mapper'

export class AstroDbAgendaSpeakersRepository implements AgendaSpeakersRepository {
  async saveBySessionId(sessionId: string, speakers: Speaker[]): Promise<void> {
    // Eliminar relaciones existentes
    await db.delete(AgendaSessionSpeaker).where(eq(AgendaSessionSpeaker.sessionId, sessionId))

    if (speakers.length > 0) {
      for (const speaker of speakers) {
        // Insertar speaker si no existe (upsert semántico)
        const existing = await db.select().from(AgendaSpeaker).where(eq(AgendaSpeaker.id, speaker.getId())).limit(1)

        if (!existing.at(0)) {
          const speakerDto = AstroDbAgendaSpeakerMapper.toDto(speaker)
          await db.insert(AgendaSpeaker).values(speakerDto)
        }

        // Crear relación session-speaker
        await db.insert(AgendaSessionSpeaker).values({
          sessionId,
          speakerId: speaker.getId(),
          createdAt: new Date(),
        })
      }
    }
  }

  async findBySessionId(sessionId: string): Promise<Speaker[]> {
    const result = await db
      .select({
        speaker: AgendaSpeaker,
      })
      .from(AgendaSessionSpeaker)
      .innerJoin(AgendaSpeaker, eq(AgendaSessionSpeaker.speakerId, AgendaSpeaker.id))
      .where(eq(AgendaSessionSpeaker.sessionId, sessionId))

    return result.map(r => AstroDbAgendaSpeakerMapper.toDomain(r.speaker))
  }

  async findAll(): Promise<Speaker[]> {
    const speakers = await db.select().from(AgendaSpeaker)
    return speakers.map(s => AstroDbAgendaSpeakerMapper.toDomain(s))
  }
}
