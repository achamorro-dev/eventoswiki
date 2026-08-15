import type { APIContext } from 'astro'
import { GetOrganizationQuery } from '@/organizations/application/get-organization.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'
import { BuildOteFeedQuery } from '@/ote/application/build-ote-feed.query'
import { OteContainer } from '@/ote/di/ote.container'
import { oteFeedToIcs } from '@/ote/domain/ote-ics.mapper'
import { OteUrls } from '@/ote/domain/ote-urls'

/** Calendario suscribible de una comunidad */
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

    return new Response(oteFeedToIcs(feed), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
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
