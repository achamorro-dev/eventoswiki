import type { APIContext } from 'astro'
import { AuthenticationLocator } from '@/authentication/di/authentication.locator'

export async function GET(context: APIContext): Promise<Response> {
  const nextUrl = context.url.searchParams.get('_next')
  const url = await AuthenticationLocator.createAuthorizationUrlCommand(
    AuthenticationLocator.twitterProvider(context.cookies),
  ).execute({ nextUrl: nextUrl || undefined })

  return context.redirect(url.toString())
}
