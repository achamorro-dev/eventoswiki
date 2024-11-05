import { Command } from '@/shared/application/use-case/command'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'
import type { AuthenticationProvider } from '../domain/authentication-provider'
import type { AuthenticationRepository } from '../domain/authentication.repository'
import { LoggedUser } from '../domain/logged-user'
import type { OAuth2Tokens } from '../domain/oauth2-tokens'
import type { SessionManager } from '../domain/session-manager'

interface Params {
  authenticationProvider: AuthenticationProvider
  code: string
  state: string
}
export class CreateSessionCommand extends Command<Params, void> {
  constructor(
    private readonly cookiesManager: CookiesManager,
    private readonly sessionManager: SessionManager,
    private readonly authenticationRepository: AuthenticationRepository,
  ) {
    super()
  }

  async execute(params: Params): Promise<void> {
    const { authenticationProvider, code, state } = params

    this.ensureIsValidState(authenticationProvider, state)

    const tokens = await this.getOAuthTokens(authenticationProvider, code)

    const loggedUser = await this.getOrCreateLoggedUser(authenticationProvider, tokens)

    await this.createSession(loggedUser)
  }

  private async createSession(loggedUser: LoggedUser) {
    const session = await this.sessionManager.createSession(loggedUser.id)
    const sessionCookie = this.sessionManager.createSessionCookie(session.id)
    this.cookiesManager.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }

  private async getOrCreateLoggedUser(
    authenticationProvider: AuthenticationProvider,
    tokens: OAuth2Tokens,
  ): Promise<LoggedUser> {
    const remoteUser = await authenticationProvider.getRemoteUser(tokens)
    let loggedUser = await this.authenticationRepository.getLoggedUser({ githubId: remoteUser.githubId })

    if (!loggedUser) {
      const userId = this.authenticationRepository.generateId()
      const user = new LoggedUser({
        id: userId,
        githubId: remoteUser.githubId,
        name: remoteUser.name,
        username: remoteUser.username,
        email: remoteUser.email,
        avatar: remoteUser.avatar,
      })

      await this.authenticationRepository.createLoggedUser(user)
      loggedUser = user
    }

    return loggedUser
  }

  private async getOAuthTokens(authenticationProvider: AuthenticationProvider, code: string) {
    return await authenticationProvider.validateAuthorizationCode(code)
  }

  private ensureIsValidState(authenticationProvider: AuthenticationProvider, state: string) {
    const storedState = authenticationProvider.getStoredState(this.cookiesManager)

    if (storedState !== state) {
      throw new Error('Invalid state')
    }
  }
}
