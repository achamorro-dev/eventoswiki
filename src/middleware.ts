import { defineMiddleware } from 'astro:middleware'
import { verifyRequestOrigin } from 'lucia'
import { lucia } from '@/shared/infrastructure/lucia/authentication'

/** La comprobación de origen protege de CSRF, así que solo aplica a los métodos que mutan estado */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export const onRequest = defineMiddleware(async (context, next) => {
  if (!SAFE_METHODS.has(context.request.method)) {
    const originHeader = context.request.headers.get('Origin')
    const hostHeader = context.request.headers.get('Host')
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return new Response(null, {
        status: 403,
      })
    }
  }

  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    context.locals.user = null
    context.locals.session = null
    return next()
  }

  const { session, user } = await lucia.validateSession(sessionId)
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id)
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie()
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }
  context.locals.session = session
  context.locals.user = user
  return next()
})
