import type { OteFeed } from '@/ote/domain/ote-event'
import { OTE_MEDIA_TYPE } from '@/ote/domain/ote-event'
import { oteFeedToIcs } from '@/ote/domain/ote-ics.mapper'

const FEED_CACHE_CONTROL = 'public, max-age=1800'

/**
 * Los feeds son públicos y anónimos, y los readers de terceros (opentechevents.org
 * entre otros) los piden desde el navegador: sin CORS abierto el `fetch` se bloquea.
 * El comodín no expone nada privado porque la respuesta nunca depende de la cookie
 * de sesión, y el navegador rechaza `*` en peticiones con credenciales.
 */
const FEED_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Accept, Content-Type',
  'Access-Control-Max-Age': '86400',
}

export function oteJsonFeedResponse(feed: OteFeed): Response {
  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': `${OTE_MEDIA_TYPE}; charset=utf-8`,
      'Cache-Control': FEED_CACHE_CONTROL,
      ...FEED_CORS_HEADERS,
    },
  })
}

export function oteIcsFeedResponse(feed: OteFeed): Response {
  return new Response(oteFeedToIcs(feed), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': FEED_CACHE_CONTROL,
      ...FEED_CORS_HEADERS,
    },
  })
}

export function feedPreflightResponse(): Response {
  return new Response(null, { status: 204, headers: FEED_CORS_HEADERS })
}

/** Sin CORS el navegador enmascara el 404 como error de CORS y despista al que depura */
export function feedNotFoundResponse(): Response {
  return new Response('Not found', { status: 404, headers: FEED_CORS_HEADERS })
}
