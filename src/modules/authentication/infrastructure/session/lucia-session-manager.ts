import type { SessionCookie } from '@/authentication/domain/session-cookie'
import { lucia } from '@/shared/infrastructure/lucia/authentication'
import { Lucia } from 'lucia'
import type { Session } from '../../domain/session'
import { SessionManager } from '../../domain/session-manager'

export class LuciaSessionManager extends SessionManager {
  lucia: Lucia

  constructor() {
    super()
    this.lucia = lucia
  }

  createBlankSession(): SessionCookie {
    return this.lucia.createBlankSessionCookie()
  }

  invalidateSession(sessionId: string): Promise<void> {
    return this.lucia.invalidateSession(sessionId)
  }

  async createSession(userId: string): Promise<Session> {
    return this.lucia.createSession(userId, {})
  }

  createSessionCookie(sessionId: string): SessionCookie {
    return this.lucia.createSessionCookie(sessionId)
  }
}
