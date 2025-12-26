import { BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'astro:env/server'
import { ObjectParser } from '@pilcrowjs/object-parser'
import { decodeIdToken, Google, generateCodeVerifier, generateState } from 'arctic'
import type { AuthenticationProvider } from '@/authentication/domain/authentication-provider'
import type { OAuth2Tokens } from '@/authentication/domain/oauth2-tokens'
import { RemoteUser } from '@/authentication/domain/remote-user'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'

export class GoogleAuthenticationProvider implements AuthenticationProvider {
  google: Google
  scopes: string[] = ['openid', 'profile', 'email']
  stateCookie = 'google_oauth_state'
  codeVerifierCookie = 'google_code_verifier'

  constructor(private readonly cookiesManager: CookiesManager) {
    const redirectUri = `${BASE_URL}/login/google/callback`
    this.google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri)
  }

  async getRemoteUser(tokens: OAuth2Tokens): Promise<RemoteUser> {
    const claims = decodeIdToken(tokens.idToken())
    const claimsParser = new ObjectParser(claims)

    const googleId = claimsParser.getString('sub')
    const name = claimsParser.getString('name')
    const picture = claimsParser.getString('picture')
    const email = claimsParser.getString('email')
    const login = email.split('@')[0] ?? ''
    return new RemoteUser({
      googleId,
      name,
      username: login,
      email: email ?? null,
      avatar: picture,
    })
  }

  getStoredState(): string | null {
    return this.cookiesManager.get(this.stateCookie)?.value ?? null
  }

  getNextUrlFromState(state: string): string | null {
    const parts = state.split(':')
    return parts.length > 1 ? decodeURIComponent(parts[1]) : null
  }

  async createAuthorizationCookie(nextUrl?: string): Promise<URL> {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    // Encode nextUrl in state if provided using format: actualState:encodedNextUrl
    const stateWithNext = nextUrl ? `${state}:${encodeURIComponent(nextUrl)}` : state
    const url = this.google.createAuthorizationURL(stateWithNext, codeVerifier, this.scopes)

    this.cookiesManager.set(this.stateCookie, state, {
      path: '/',
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    })
    this.cookiesManager.set(this.codeVerifierCookie, codeVerifier, {
      path: '/',
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    })

    return url
  }

  validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
    const codeVerifier = this.cookiesManager.get(this.codeVerifierCookie)?.value ?? null
    if (!codeVerifier) {
      throw new Error('Invalid code verifier')
    }
    return this.google.validateAuthorizationCode(code, codeVerifier)
  }
}
