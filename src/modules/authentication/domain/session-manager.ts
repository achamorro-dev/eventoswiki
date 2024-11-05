import type { Session } from './session'
import type { SessionCookie } from './session-cookie'

export abstract class SessionManager {
  sessionName: string = 'auth_session'

  abstract createBlankSession(): SessionCookie
  abstract invalidateSession(sessionId: string): Promise<void>
  abstract createSession(userId: string): Promise<Session>
  abstract createSessionCookie(sessionId: string): SessionCookie
}
