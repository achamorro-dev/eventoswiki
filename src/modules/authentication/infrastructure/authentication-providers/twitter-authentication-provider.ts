import type { AuthenticationProvider } from '@/authentication/domain/authentication-provider'
import type { OAuth2Tokens } from '@/authentication/domain/oauth2-tokens'
import { RemoteUser } from '@/authentication/domain/remote-user'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'
import { Twitter, generateCodeVerifier, generateState } from 'arctic'
import { BASE_URL, TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from 'astro:env/server'

export class TwitterAuthenticationProvider implements AuthenticationProvider {
  twitter: Twitter
  scopes: string[] = ['tweet.read', 'users.read', 'offline.access']
  stateCookie = 'twitter_oauth_state'
  codeVerifierCookie = 'twitter_code_verifier'
  userUrl = 'https://api.twitter.com/2/users/me'

  constructor(private readonly cookiesManager: CookiesManager) {
    const redirectUri = `${BASE_URL}/login/twitter/callback`
    this.twitter = new Twitter(TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, redirectUri)
  }

  async getRemoteUser(tokens: OAuth2Tokens): Promise<RemoteUser> {
    const twitterUserUrl = new URL(this.userUrl)
    twitterUserUrl.searchParams.append('user.fields', 'id,name,username,profile_image_url')
    const userResponse = await fetch(twitterUserUrl, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    })

    const { data } = (await userResponse.json()) as { data: TwitterUserDto }
    return new RemoteUser({
      twitterId: data.id,
      name: data.name,
      username: data.username,
      email: null,
      avatar: data.profile_image_url,
    })
  }

  getStoredState(): string | null {
    return this.cookiesManager.get(this.stateCookie)?.value ?? null
  }

  async createAuthorizationCookie(): Promise<URL> {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const url = this.twitter.createAuthorizationURL(state, codeVerifier, this.scopes)

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
    return this.twitter.validateAuthorizationCode(code, codeVerifier)
  }
}
