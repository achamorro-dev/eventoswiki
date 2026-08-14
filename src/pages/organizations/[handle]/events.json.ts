import type { APIContext } from 'astro'
import { GetOrganizationQuery } from '@/organizations/application/get-organization.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'
import { BuildOteFeedQuery } from '@/ote/application/build-ote-feed.query'
import { OteContainer } from '@/ote/di/ote.container'
import { OTE_MEDIA_TYPE } from '@/ote/domain/ote-event'
import { OteUrls } from '@/ote/domain/ote-urls'

/** Feed OpenTechEvents de una comunidad — https://opentechevents.org */
export async function GET(context: APIContext): Promise<Response> {
  const handle = context.params.handle

  if (!handle) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const organization = await OrganizationsContainer.get(GetOrganizationQuery).execute({ handle })

    const feed = await OteContainer.get(BuildOteFeedQuery).execute({
      title: organization.name,
      url: OteUrls.ORGANIZATION(organization.handle),
      description: organization.bio || undefined,
      organizationId: organization.id.value,
    })

    return new Response(JSON.stringify(feed, null, 2), {
      headers: {
        'Content-Type': `${OTE_MEDIA_TYPE}; charset=utf-8`,
        'Cache-Control': 'public, max-age=600',
      },
    })
  } catch (error) {
    if (error instanceof OrganizationNotFound) {
      return new Response('Not found', { status: 404 })
    }

    throw error
  }
}
