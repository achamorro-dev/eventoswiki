import { Session } from './session'

export abstract class AgendaSessionsRepository {
  abstract saveByTrackId(trackId: string, sessions: Session[]): Promise<void>
  abstract findByTrackId(trackId: string): Promise<Session[]>
  abstract deleteByTrackId(trackId: string): Promise<void>
}
