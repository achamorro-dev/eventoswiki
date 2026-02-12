import { Agenda, asc, db, eq } from 'astro:db'
import type { AgendaItemsRepository } from '../../domain/agenda/agenda-items.repository'
import { CommonElement } from '../../domain/agenda/common-element'
import { AstroDbAgendaItemMapper } from './mappers/astro-db-agenda-item.mapper'

export class AstroDbAgendaItemsRepository implements AgendaItemsRepository {
  async saveByEventId(eventId: string, elements: CommonElement[]): Promise<void> {
    await this.deleteByEventId(eventId)

    if (elements.length > 0) {
      const elementsToInsert = elements.map(element => AstroDbAgendaItemMapper.toDto(element, eventId))
      await db.insert(Agenda).values(elementsToInsert)
    }
  }

  async findByEventId(eventId: string): Promise<CommonElement[]> {
    const elementsDto = await db.select().from(Agenda).where(eq(Agenda.eventId, eventId)).orderBy(asc(Agenda.order))

    return elementsDto.map(e => AstroDbAgendaItemMapper.toDomain(e))
  }

  async deleteByEventId(eventId: string): Promise<void> {
    await db.delete(Agenda).where(eq(Agenda.eventId, eventId))
  }
}
