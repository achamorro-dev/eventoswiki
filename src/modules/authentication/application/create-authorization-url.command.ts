import { Command } from '@/shared/application/use-case/command'
import type { AuthenticationProvider } from '../domain/authentication-provider'

interface Params {
  nextUrl?: string
}

export class CreateAuthorizationUrlCommand extends Command<Params, URL> {
  constructor(private readonly authenticationProvider: AuthenticationProvider) {
    super()
  }

  async execute(params: Params = {}): Promise<URL> {
    const { nextUrl } = params
    return this.authenticationProvider.createAuthorizationCookie(nextUrl)
  }
}
