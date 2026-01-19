import { BASE_URL, OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET } from 'astro:env/server'
import { GitHub, generateState } from 'arctic'
import type { AuthenticationProvider } from '@/authentication/domain/authentication-provider'
import type { OAuth2Tokens } from '@/authentication/domain/oauth2-tokens'
import { RemoteUser } from '@/authentication/domain/remote-user'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'

export class GitHubAuthenticationProvider implements AuthenticationProvider {
  github: GitHub
  scopes: string[] = ['user:email']
  stateCookie = 'github_oauth_state'
  userUrl = 'https://api.github.com/user'

  constructor(private readonly cookiesManager: CookiesManager) {
    const redirectUri = `${BASE_URL}/login/github/callback`
    this.github = new GitHub(OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET, redirectUri)
  }

  async getRemoteUser(tokens: OAuth2Tokens): Promise<RemoteUser> {
    const githubUserResponse = await fetch(this.userUrl, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    })

    const githubUser: GitHubUserDto = await githubUserResponse.json()
    return new RemoteUser({
      githubId: githubUser.id,
      name: githubUser.name,
      username: githubUser.login,
      email: githubUser.email ?? null,
      avatar: githubUser.avatar_url,
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
    // Encode nextUrl in state if provided using format: actualState:encodedNextUrl
    const stateWithNext = nextUrl ? `${state}:${encodeURIComponent(nextUrl)}` : state
    const url = this.github.createAuthorizationURL(stateWithNext, this.scopes)

    this.cookiesManager.set(this.stateCookie, state, {
      path: '/',
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    })

    return url
  }

  validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
    return this.github.validateAuthorizationCode(code)
  }
}
