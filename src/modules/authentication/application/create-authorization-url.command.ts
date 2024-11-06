import { Command } from '@/shared/application/use-case/command'
import type { CookiesManager } from '@/shared/domain/cookies/cookies-manager'
import type { AuthenticationProvider } from '../domain/authentication-provider'

export class CreateAuthorizationUrlCommand extends Command<void, URL> {
  constructor(private readonly authenticationProvider: AuthenticationProvider) {
    super()
  }

  async execute(): Promise<URL> {
    return this.authenticationProvider.createAuthorizationCookie()
  }
}
