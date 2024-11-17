import { OAuth2RequestError } from 'arctic'

import { AuthenticationLocator } from '@/authentication/di/authentication.locator'
import { Urls } from '@/ui/urls/urls'
import type { APIContext } from 'astro'

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
      authenticationProvider: AuthenticationLocator.twitterProvider(context.cookies),
      code,
      state,
    })

    return context.redirect(Urls.HOME)
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
