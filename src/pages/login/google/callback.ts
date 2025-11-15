import { OAuth2RequestError } from 'arctic'
import type { APIContext } from 'astro'
import { AuthenticationLocator } from '@/authentication/di/authentication.locator'

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get('code')
  const state = context.url.searchParams.get('state')

  if (!code || !state) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    await AuthenticationLocator.createSessionCommand(context.cookies).execute({
      authenticationProvider: AuthenticationLocator.googleProvider(context.cookies),
      code,
      state,
    })

    return context.redirect('/')
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
