import { Organization } from '@/organizations/domain/organization'
import { Datetime } from '@/shared/domain/datetime/datetime'
import type { AstroDbOrganizationDto } from '../dtos/astro-db-organization.dto'

export class AstroOrganizationMapper {
  static toDomainList(dtos: { Organization: AstroDbOrganizationDto }[]): Organization[] {
    return dtos.map(({ Organization }) => this.toDomain(Organization, [], []))
  }

  static toDomain(dto: AstroDbOrganizationDto, organizerIds: string[], followerIds: string[]): Organization {
    return Organization.fromPrimitives({
      id: dto.id,
      handle: dto.handle,
      name: dto.name,
      bio: dto.bio,
      image: dto.image || undefined,
      location: dto.location,
      web: dto.web || undefined,
      twitter: dto.twitter || undefined,
      linkedin: dto.linkedin || undefined,
      youtube: dto.youtube || undefined,
      twitch: dto.twitch || undefined,
      facebook: dto.facebook || undefined,
      instagram: dto.instagram || undefined,
      github: dto.github || undefined,
      telegram: dto.telegram || undefined,
      whatsapp: dto.whatsapp || undefined,
      discord: dto.discord || undefined,
      tiktok: dto.tiktok || undefined,
      createdAt: Datetime.toIsoString(dto.createdAt),
      updatedAt: Datetime.toIsoString(dto.updatedAt),
      organizers: organizerIds,
      followers: followerIds,
    })
  }
}
