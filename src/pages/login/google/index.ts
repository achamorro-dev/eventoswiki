import { AuthenticationLocator } from '@/authentication/di/authentication.locator'

import type { APIContext } from 'astro'

export async function GET(context: APIContext): Promise<Response> {
  const url = await AuthenticationLocator.createAuthorizationUrlCommand(
    AuthenticationLocator.googleProvider(context.cookies),
  ).execute()

  return context.redirect(url.toString())
}
