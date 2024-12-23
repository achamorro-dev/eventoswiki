import { CreateAuthorizationUrlCommand } from '@/authentication/application/create-authorization-url.command'
import { CreateSessionCommand } from '@/authentication/application/create-session.command'
import { InvalidateSessionCommand } from '@/authentication/application/invalidate-session.command'
import type { AuthenticationProvider } from '@/authentication/domain/authentication-provider'
import { GitHubAuthenticationProvider } from '@/authentication/infrastructure/authentication-providers/github-authentication-provider'
import { GoogleAuthenticationProvider } from '@/authentication/infrastructure/authentication-providers/google-authentication-provider'
import { TwitterAuthenticationProvider } from '@/authentication/infrastructure/authentication-providers/twitter-authentication-provider'
import { AstroDbAuthenticationRepository } from '@/authentication/infrastructure/repositories/astro-db-authentication.repository'
import { LuciaSessionManager } from '@/authentication/infrastructure/session/lucia-session-manager'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'
import { DeleteLoggedUserCommand } from '../application/delete-logged-user.command'

export class AuthenticationLocator {
  static sessionManager = new LuciaSessionManager()
  static authenticationRepository = new AstroDbAuthenticationRepository()

  static githubProvider(cookiesManager: CookiesManager) {
    return new GitHubAuthenticationProvider(cookiesManager)
  }

  static googleProvider(cookiesManager: CookiesManager) {
    return new GoogleAuthenticationProvider(cookiesManager)
  }

  static twitterProvider(cookiesManager: CookiesManager) {
    return new TwitterAuthenticationProvider(cookiesManager)
  }

  static createAuthorizationUrlCommand(authenticationProvider: AuthenticationProvider) {
    return new CreateAuthorizationUrlCommand(authenticationProvider)
  }

  static invalidateSessionCommand(cookiesManager: CookiesManager) {
    return new InvalidateSessionCommand(this.sessionManager, cookiesManager)
  }

  static createSessionCommand(cookiesManager: CookiesManager) {
    return new CreateSessionCommand(cookiesManager, this.sessionManager, this.authenticationRepository)
  }

  static deleteLoggedUserCommand(cookiesManager: CookiesManager) {
    return new DeleteLoggedUserCommand(
      this.invalidateSessionCommand(cookiesManager),
      AuthenticationLocator.authenticationRepository,
    )
  }
}
