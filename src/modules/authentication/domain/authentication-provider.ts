import type { OAuth2Tokens } from './oauth2-tokens'
import type { RemoteUser } from './remote-user'

export interface AuthenticationProvider {
  createAuthorizationCookie(): Promise<URL>
  validateAuthorizationCode(code: string): Promise<OAuth2Tokens>
  getStoredState(): string | null
  getRemoteUser(tokens: OAuth2Tokens): Promise<RemoteUser>
}
