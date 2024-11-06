import type { AuthenticationProvider } from '@/authentication/domain/authentication-provider'
import type { OAuth2Tokens } from '@/authentication/domain/oauth2-tokens'
import { RemoteUser } from '@/authentication/domain/remote-user'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'
import { GitHub, generateState } from 'arctic'
import { BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from 'astro:env/server'

export class GitHubAuthenticationProvider implements AuthenticationProvider {
  github: GitHub
  scopes: string[] = ['user:email']
  stateCookie = 'github_oauth_state'
  userUrl = 'https://api.github.com/user'

  constructor(private readonly cookiesManager: CookiesManager) {
    const redirectUri = `${BASE_URL}/login/github/callback`
    this.github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, redirectUri)
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

  async createAuthorizationCookie(): Promise<URL> {
    const state = generateState()
    const url = this.github.createAuthorizationURL(state, this.scopes)

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
