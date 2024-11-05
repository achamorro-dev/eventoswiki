import { Command } from '@/shared/application/use-case/command'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'
import type { SessionManager } from '../domain/session-manager'

export class InvalidateSessionCommand extends Command<{ sessionId: string }> {
  constructor(
    private readonly sessionManager: SessionManager,
    private readonly cookiesManager: CookiesManager,
  ) {
    super()
  }

  async execute({ sessionId }: { sessionId: string }): Promise<void> {
    await this.sessionManager.invalidateSession(sessionId)
    this.cookiesManager.delete(this.sessionManager.sessionName)
  }
}
