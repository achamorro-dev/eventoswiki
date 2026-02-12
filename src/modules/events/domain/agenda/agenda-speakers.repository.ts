import { Speaker } from './speaker'

export abstract class AgendaSpeakersRepository {
  abstract saveBySessionId(sessionId: string, speakers: Speaker[]): Promise<void>
  abstract findBySessionId(sessionId: string): Promise<Speaker[]>
  abstract findAll(): Promise<Speaker[]>
}
