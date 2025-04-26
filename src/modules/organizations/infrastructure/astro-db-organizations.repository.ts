import { Organization, OrganizationUser, db, eq } from 'astro:db'
import { Organization as OrganizationEntity } from '../domain/organization'
import type { OrganizationsRepository } from '../domain/organizations.repository'
import { AstroOrganizationMapper } from './mappers/astro-db-organization.mapper'

export class AstroDbOrganizationsRepository implements OrganizationsRepository {
  async findOrganizationsByUserId(userId: string): Promise<OrganizationEntity[]> {
    const result = await db
      .select({ Organization })
      .from(Organization)
      .innerJoin(OrganizationUser, eq(Organization.id, OrganizationUser.organizationId))
      .where(eq(OrganizationUser.userId, userId))

    return AstroOrganizationMapper.toDomainList(result)
  }

  async save(value: OrganizationEntity): Promise<void> {
    const organization = await db.select().from(Organization).where(eq(Organization.id, value.id.value))
    const hasOrganization = organization.length !== 0

    return hasOrganization ? this._updateOrganization(value) : this._insertOrganization(value)
  }

  private async _updateOrganization(value: OrganizationEntity) {
    await db
      .update(Organization)
      .set({
        handle: value.handle,
        name: value.name,
        bio: value.bio,
        image: value.image?.toString() ?? null,
        location: value.location,
        web: value.web,
        twitter: value.twitter,
        linkedin: value.linkedin,
        youtube: value.youtube,
        twitch: value.twitch,
        facebook: value.facebook,
        instagram: value.instagram,
        github: value.github,
        telegram: value.telegram,
        whatsapp: value.whatsapp,
        discord: value.discord,
        tiktok: value.tiktok,
        updatedAt: new Date(),
      })
      .where(eq(Organization.id, value.id.value))
  }

  private async _insertOrganization(value: OrganizationEntity) {
    await db.insert(Organization).values({
      id: value.id.value,
      handle: value.handle,
      name: value.name,
      bio: value.bio,
      image: value.image?.toString() ?? null,
      location: value.location,
      web: value.web,
      twitter: value.twitter,
      linkedin: value.linkedin,
      youtube: value.youtube,
      twitch: value.twitch,
      facebook: value.facebook,
      instagram: value.instagram,
      github: value.github,
      telegram: value.telegram,
      whatsapp: value.whatsapp,
      discord: value.discord,
      tiktok: value.tiktok,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.insert(OrganizationUser).values({
      organizationId: value.id.value,
      userId: value.organizers[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return
  }
}
