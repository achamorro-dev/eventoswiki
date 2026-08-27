import { BuildOteFeedQuery } from '@/ote/application/build-ote-feed.query'
import { OteContainer } from '@/ote/di/ote.container'
import { SITE_URL } from '@/ote/domain/ote-urls'
import { feedPreflightResponse, oteJsonFeedResponse } from '@/ote/presentation/server/feed-response'

const FEED_DESCRIPTION = 'Eventos y meetups tecnológicos de España publicados en eventos.wiki'

/** Feed OpenTechEvents del directorio completo — https://opentechevents.org */
export async function GET(): Promise<Response> {
  const feed = await OteContainer.get(BuildOteFeedQuery).execute({
    title: 'eventos.wiki',
    url: SITE_URL,
    description: FEED_DESCRIPTION,
  })

  return oteJsonFeedResponse(feed)
}

export function OPTIONS(): Response {
  return feedPreflightResponse()
}
