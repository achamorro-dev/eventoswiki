import { CreateAuthorizationUrlCommand } from '@/authentication/application/create-authorization-url.command'
import { CreateSessionCommand } from '@/authentication/application/create-session.command'
import { DeleteLoggedUserCommand } from '@/authentication/application/delete-logged-user.command'
import { InvalidateSessionCommand } from '@/authentication/application/invalidate-session.command'
import type { AuthenticationProvider } from '@/authentication/domain/authentication-provider'
import { GitHubAuthenticationProvider } from '@/authentication/infrastructure/authentication-providers/github-authentication-provider'
import { GoogleAuthenticationProvider } from '@/authentication/infrastructure/authentication-providers/google-authentication-provider'
import { TwitterAuthenticationProvider } from '@/authentication/infrastructure/authentication-providers/twitter-authentication-provider'
import { AstroDbAuthenticationRepository } from '@/authentication/infrastructure/repositories/astro-db-authentication.repository'
import { LuciaSessionManager } from '@/authentication/infrastructure/session/lucia-session-manager'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'

// Singleton instances
const sessionManager = new LuciaSessionManager()
const authenticationRepository = new AstroDbAuthenticationRepository()

// Provider factory functions
export function getGitHubProvider(cookiesManager: CookiesManager): AuthenticationProvider {
  return new GitHubAuthenticationProvider(cookiesManager)
}

export function getGoogleProvider(cookiesManager: CookiesManager): AuthenticationProvider {
  return new GoogleAuthenticationProvider(cookiesManager)
}

export function getTwitterProvider(cookiesManager: CookiesManager): AuthenticationProvider {
  return new TwitterAuthenticationProvider(cookiesManager)
}

// Command factory functions
export function createCreateSessionCommand(cookiesManager: CookiesManager): CreateSessionCommand {
  return new CreateSessionCommand(cookiesManager, sessionManager, authenticationRepository)
}

export function createInvalidateSessionCommand(cookiesManager: CookiesManager): InvalidateSessionCommand {
  return new InvalidateSessionCommand(sessionManager, cookiesManager)
}

export function createDeleteLoggedUserCommand(cookiesManager: CookiesManager): DeleteLoggedUserCommand {
  const invalidateSessionCommand = createInvalidateSessionCommand(cookiesManager)
  return new DeleteLoggedUserCommand(invalidateSessionCommand, authenticationRepository)
}

export function getCreateAuthorizationUrlCommand(
  authenticationProvider: AuthenticationProvider,
): CreateAuthorizationUrlCommand {
  return new CreateAuthorizationUrlCommand(authenticationProvider)
}
