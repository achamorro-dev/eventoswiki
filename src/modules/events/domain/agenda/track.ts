import { ValueObject } from '@/shared/domain/value-object'
import { Session, type SessionPrimitives } from './session'

export interface TrackProps {
  id: string
  name: string
  description?: string
  sessions: Session[]
}

export type TrackPrimitives = {
  id: string
  name: string
  description?: string
  sessions: SessionPrimitives[]
}

export class Track extends ValueObject<TrackProps> {
  constructor(value: TrackProps) {
    Track.ensureIsValid(value)
    super(value)
  }

  static fromPrimitives(primitives: TrackPrimitives): Track {
    return new Track({
      id: primitives.id,
      name: primitives.name,
      description: primitives.description,
      sessions: primitives.sessions.map(s => Session.fromPrimitives(s)),
    })
  }

  toPrimitives(): TrackPrimitives {
    return {
      id: this.value.id,
      name: this.value.name,
      description: this.value.description,
      sessions: this.value.sessions.map(s => s.toPrimitives()),
    }
  }

  static create(data: { id: string; name: string; description?: string; sessions?: Session[] }): Track {
    return new Track({
      id: data.id,
      name: data.name,
      description: data.description,
      sessions: data.sessions || [],
    })
  }

  private static ensureIsValid(data: TrackProps): void {
    const { name } = data

    if (typeof name !== 'string' || name.trim().length < 1) {
      throw new Error('El nombre del track es obligatorio')
    }
  }

  getId(): string {
    return this.value.id
  }

  getName(): string {
    return this.value.name
  }

  getDescription(): string | undefined {
    return this.value.description
  }

  getSessions(): Session[] {
    return [...this.value.sessions]
  }

  hasDescription(): boolean {
    return !!this.value.description
  }

  hasSessions(): boolean {
    return this.value.sessions.length > 0
  }

  getSessionCount(): number {
    return this.value.sessions.length
  }

  addSession(session: Session): void {
    this.value.sessions.push(session)
  }

  removeSession(sessionId: string): void {
    this.value.sessions = this.value.sessions.filter(s => s.getId() !== sessionId)
  }

  getSessionById(sessionId: string): Session | undefined {
    return this.value.sessions.find(s => s.getId() === sessionId)
  }

  updateSession(sessionId: string, session: Session): void {
    const index = this.value.sessions.findIndex(s => s.getId() === sessionId)
    if (index >= 0) {
      this.value.sessions[index] = session
    }
  }

  getSessionsByDate(date: Date): Session[] {
    const targetDate = date.toDateString()
    return this.value.sessions.filter(s => s.getStartsAt().toDateString() === targetDate)
  }

  hasOverlappingSessions(): boolean {
    for (let i = 0; i < this.value.sessions.length; i++) {
      for (let j = i + 1; j < this.value.sessions.length; j++) {
        if (this.value.sessions[i].overlapsWith(this.value.sessions[j])) {
          return true
        }
      }
    }
    return false
  }
}
