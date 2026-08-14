import { BuildOteFeedQuery } from '@/ote/application/build-ote-feed.query'
import { OteContainer } from '@/ote/di/ote.container'
import { OTE_MEDIA_TYPE } from '@/ote/domain/ote-event'
import { SITE_URL } from '@/ote/domain/ote-urls'

const FEED_DESCRIPTION = 'Eventos y meetups tecnológicos de España publicados en eventos.wiki'

/** Feed OpenTechEvents del directorio completo — https://opentechevents.org */
export async function GET(): Promise<Response> {
  const feed = await OteContainer.get(BuildOteFeedQuery).execute({
    title: 'eventos.wiki',
    url: SITE_URL,
    description: FEED_DESCRIPTION,
  })

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': `${OTE_MEDIA_TYPE}; charset=utf-8`,
      'Cache-Control': 'public, max-age=600',
    },
  })
}
