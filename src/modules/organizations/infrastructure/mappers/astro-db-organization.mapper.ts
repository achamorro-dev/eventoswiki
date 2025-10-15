import { Organization } from '@/organizations/domain/organization'
import { Datetime } from '@/shared/domain/datetime/datetime'
import type { AstroDbProvinceDto } from '@/shared/infrastructure/provinces/astro-db-province-dto'
import type { AstroDbOrganizationDto } from '../dtos/astro-db-organization.dto'

interface ToDomainParams {
  organization: AstroDbOrganizationDto
  organizerIds: string[]
  followerIds: string[]
  province: AstroDbProvinceDto | null | undefined
}

export class AstroOrganizationMapper {
  static toDomainList(
    dtos: { Organization: AstroDbOrganizationDto; Province: AstroDbProvinceDto | null | undefined }[],
  ): Organization[] {
    return dtos.map(({ Organization, Province }) =>
      this.toDomain({
        organization: Organization,
        province: Province,
        organizerIds: [],
        followerIds: [],
      }),
    )
  }

  static toDomain({ organization, organizerIds, followerIds, province }: ToDomainParams): Organization {
    return Organization.fromPrimitives({
      id: organization.id,
      handle: organization.handle,
      name: organization.name,
      bio: organization.bio,
      image: organization.image || undefined,
      web: organization.web || undefined,
      location: province?.name || null,
      twitter: organization.twitter || undefined,
      linkedin: organization.linkedin || undefined,
      youtube: organization.youtube || undefined,
      twitch: organization.twitch || undefined,
      facebook: organization.facebook || undefined,
      instagram: organization.instagram || undefined,
      github: organization.github || undefined,
      telegram: organization.telegram || undefined,
      whatsapp: organization.whatsapp || undefined,
      discord: organization.discord || undefined,
      tiktok: organization.tiktok || undefined,
      createdAt: Datetime.toIsoString(organization.createdAt),
      updatedAt: Datetime.toIsoString(organization.updatedAt),
      organizers: organizerIds,
      followers: followerIds,
    })
  }
}
