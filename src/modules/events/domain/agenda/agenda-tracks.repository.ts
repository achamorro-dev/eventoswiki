import { Track } from './track'

export abstract class AgendaTracksRepository {
  abstract saveByEventId(eventId: string, tracks: Track[]): Promise<void>
  abstract findByEventId(eventId: string): Promise<Track[]>
  abstract deleteByEventId(eventId: string): Promise<void>
}
