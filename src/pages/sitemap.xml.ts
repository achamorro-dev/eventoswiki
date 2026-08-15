import { FindEventsQuery } from '@/events/application/find-events.query'
import { EventsContainer } from '@/events/di/events.container'
import { FindMeetupsQuery } from '@/meetups/application/find-meetups.query'
import { MeetupsContainer } from '@/meetups/di/meetups.container'
import { MatchOrganizationsQuery } from '@/organizations/application/match-organizations.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { SITE_URL } from '@/ote/domain/ote-urls'
import { GetProvincesQuery } from '@/provinces/application/get-provinces.query'
import { ProvincesContainer } from '@/provinces/di/provinces.container'
import { Urls } from '@/ui/urls/urls'

/**
 * `@astrojs/sitemap` no sirve aquí: con `output: 'server'` y sin una sola ruta
 * prerenderizada no tendría nada que recorrer. De ahí este endpoint.
 */
const MAX_ITEMS = 5000

const STATIC_PATHS = [
  Urls.HOME,
  Urls.EVENTS,
  Urls.PAST_EVENTS,
  Urls.MEETUPS,
  Urls.PAST_MEETUPS,
  Urls.ORGANIZATIONS,
  Urls.CALENDAR,
  Urls.CHANGELOG,
  Urls.FEATURE_REQUEST,
  Urls.BUG_REPORT,
  Urls.PRIVACY,
  Urls.TERMS,
]

export async function GET(): Promise<Response> {
  const [events, meetups, organizations, provinces] = await Promise.all([
    EventsContainer.get(FindEventsQuery).execute({ limit: MAX_ITEMS }),
    MeetupsContainer.get(FindMeetupsQuery).execute({ limit: MAX_ITEMS }),
    OrganizationsContainer.get(MatchOrganizationsQuery).execute({ count: MAX_ITEMS }),
    ProvincesContainer.get(GetProvincesQuery).execute(),
  ])

  const paths = [
    ...STATIC_PATHS,
    ...provinces.map(province => Urls.PROVINCE(province.slug)),
    ...events.data.map(event => Urls.EVENT(event.slug)),
    ...meetups.data.map(meetup => Urls.MEETUP(meetup.slug)),
    // `/organizations/[handle]` redirige, así que se indexan las pestañas reales.
    ...organizations.data.flatMap(organization => [
      Urls.ORGANIZATION_EVENTS(organization.handle),
      Urls.ORGANIZATION_MEETUPS(organization.handle),
    ]),
  ]

  const urls = paths.map(path => `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc></url>`).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
