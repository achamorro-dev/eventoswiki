import { BuildOteFeedQuery } from '@/ote/application/build-ote-feed.query'
import { OteContainer } from '@/ote/di/ote.container'
import { oteFeedToIcs } from '@/ote/domain/ote-ics.mapper'
import { SITE_URL } from '@/ote/domain/ote-urls'

const FEED_DESCRIPTION = 'Eventos y meetups tecnológicos de España publicados en eventos.wiki'

/** Calendario suscribible con todo el directorio */
export async function GET(): Promise<Response> {
  const feed = await OteContainer.get(BuildOteFeedQuery).execute({
    title: 'eventos.wiki',
    url: SITE_URL,
    description: FEED_DESCRIPTION,
  })

  return new Response(oteFeedToIcs(feed), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  })
}
