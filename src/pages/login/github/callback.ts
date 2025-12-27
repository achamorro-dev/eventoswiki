import { OAuth2RequestError } from 'arctic'
import type { APIContext } from 'astro'
import { createCreateSessionCommand, getGitHubProvider } from '@/authentication/di/authentication.container'

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get('code')
  const state = context.url.searchParams.get('state')
  if (!code || !state) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    const provider = getGitHubProvider(context.cookies)
    const command = createCreateSessionCommand(context.cookies)
    await command.execute({
      authenticationProvider: provider,
      code,
      state,
    })

    // Get the next URL from the state parameter or default to home
    const nextUrl = provider.getNextUrlFromState(state) || '/'
    return context.redirect(nextUrl)
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      })
    }
    return new Response(null, {
      status: 500,
    })
  }
}
