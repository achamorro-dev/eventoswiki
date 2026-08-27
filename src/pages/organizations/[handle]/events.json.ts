import type { APIContext } from 'astro'
import { GetOrganizationQuery } from '@/organizations/application/get-organization.query'
import { OrganizationsContainer } from '@/organizations/di/organizations.container'
import { OrganizationNotFound } from '@/organizations/domain/errors/organization-not-found.error'
import { BuildOteFeedQuery } from '@/ote/application/build-ote-feed.query'
import { OteContainer } from '@/ote/di/ote.container'
import { OteUrls } from '@/ote/domain/ote-urls'
import {
  feedNotFoundResponse,
  feedPreflightResponse,
  oteJsonFeedResponse,
} from '@/ote/presentation/server/feed-response'

/** Feed OpenTechEvents de una comunidad — https://opentechevents.org */
export async function GET(context: APIContext): Promise<Response> {
  const handle = context.params.handle

  if (!handle) {
    return feedNotFoundResponse()
  }

  try {
    const organization = await OrganizationsContainer.get(GetOrganizationQuery).execute({ handle })

    const feed = await OteContainer.get(BuildOteFeedQuery).execute({
      title: organization.name,
      url: OteUrls.ORGANIZATION(organization.handle),
      description: organization.bio || undefined,
      organizationId: organization.id.value,
    })

    return oteJsonFeedResponse(feed)
  } catch (error) {
    if (error instanceof OrganizationNotFound) {
      return feedNotFoundResponse()
    }

    throw error
  }
}

export function OPTIONS(): Response {
  return feedPreflightResponse()
}
