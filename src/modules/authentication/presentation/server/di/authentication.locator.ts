import { CreateAuthorizationUrlCommand } from '@/authentication/application/create-authorization-url.command'
import { CreateSessionCommand } from '@/authentication/application/create-session.command'
import { InvalidateSessionCommand } from '@/authentication/application/invalidate-session.command'
import type { AuthenticationProvider } from '@/authentication/domain/authentication-provider'
import { GitHubAuthenticationProvider } from '@/authentication/infrastructure/authentication-providers/github-authentication-provider'
import { AstroDbAuthenticationRepository } from '@/authentication/infrastructure/repositories/astro-db-authentication.repository'
import { LuciaSessionManager } from '@/authentication/infrastructure/session/lucia-session-manager'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'

export class AuthenticationLocator {
  static sessionManager = new LuciaSessionManager()
  static authenticationRepository = new AstroDbAuthenticationRepository()

  static githubProvider() {
    return new GitHubAuthenticationProvider()
  }

  static createAuthorizationUrlCommand(authenticationProvider: AuthenticationProvider, cookiesManager: CookiesManager) {
    return new CreateAuthorizationUrlCommand(authenticationProvider, cookiesManager)
  }

  static invalidateSessionCommand(cookiesManager: CookiesManager) {
    return new InvalidateSessionCommand(this.sessionManager, cookiesManager)
  }

  static createSessionCommand(cookiesManager: CookiesManager) {
    return new CreateSessionCommand(cookiesManager, this.sessionManager, this.authenticationRepository)
  }
}
