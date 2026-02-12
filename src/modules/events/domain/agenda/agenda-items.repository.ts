import { CommonElement } from './common-element'

export abstract class AgendaItemsRepository {
  abstract saveByEventId(eventId: string, elements: CommonElement[]): Promise<void>
  abstract findByEventId(eventId: string): Promise<CommonElement[]>
  abstract deleteByEventId(eventId: string): Promise<void>
}
