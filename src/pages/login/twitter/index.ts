import type { APIContext } from 'astro'
import { AuthenticationLocator } from '@/authentication/di/authentication.locator'

export async function GET(context: APIContext): Promise<Response> {
  const url = await AuthenticationLocator.createAuthorizationUrlCommand(
    AuthenticationLocator.twitterProvider(context.cookies),
  ).execute()

  return context.redirect(url.toString())
}
