import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'
import type { OAuth2Tokens } from './oauth2-tokens'
import type { RemoteUser } from './remote-user'

export interface AuthenticationProvider {
  createAuthorizationCookie(cookiesManager: CookiesManager): Promise<URL>
  validateAuthorizationCode(code: string): Promise<OAuth2Tokens>
  getStoredState(cookiesManager: CookiesManager): string | null
  getRemoteUser(tokens: OAuth2Tokens): Promise<RemoteUser>
}
