import type { APIContext } from 'astro'
import { getCreateAuthorizationUrlCommand, getTwitterProvider } from '@/authentication/di/authentication.container'

export async function GET(context: APIContext): Promise<Response> {
  const nextUrl = context.url.searchParams.get('_next')
  const provider = getTwitterProvider(context.cookies)
  const command = getCreateAuthorizationUrlCommand(provider)
  const url = await command.execute({ nextUrl: nextUrl || undefined })

  return context.redirect(url.toString())
}
