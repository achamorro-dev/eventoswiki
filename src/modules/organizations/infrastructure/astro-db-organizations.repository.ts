import { Organization, OrganizationUser, Province, db, eq, isDbError } from 'astro:db'
import { OrganizationAlreadyExists } from '../domain/errors/organization-already-exists.error'
import { OrganizationNotFound } from '../domain/errors/organization-not-found.error'
import { Organization as OrganizationEntity } from '../domain/organization'
import type { OrganizationId } from '../domain/organization-id'
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

  async findByHandle(handle: OrganizationEntity['handle']): Promise<OrganizationEntity> {
    const organizationResult = await db
      .select()
      .from(Organization)
      .leftJoin(Province, eq(Province.slug, Organization.location))
      .where(eq(Organization.handle, handle))
      .limit(1)

    const organizersResult = await db
      .select()
      .from(OrganizationUser)
      .innerJoin(Organization, eq(OrganizationUser.organizationId, Organization.id))
      .where(eq(Organization.handle, handle))

    const organization = organizationResult.at(0)?.Organization
    const province = organizationResult.at(0)?.Province
    const organizerIds = organizersResult.map(({ OrganizationUser }) => OrganizationUser.userId)

    if (!organization) {
      throw new OrganizationNotFound(handle)
    }

    return AstroOrganizationMapper.toDomain({ ...organization, location: province?.name ?? null }, organizerIds)
  }

  async find(id: OrganizationId): Promise<OrganizationEntity> {
    const organizationResult = await db
      .select()
      .from(Organization)
      .leftJoin(Province, eq(Province.slug, Organization.location))
      .where(eq(Organization.id, id.value))
      .limit(1)

    const organizersResult = await db
      .select()
      .from(OrganizationUser)
      .innerJoin(Organization, eq(OrganizationUser.organizationId, Organization.id))
      .where(eq(Organization.id, id.value))

    const organization = organizationResult.at(0)?.Organization
    const province = organizationResult.at(0)?.Province
    const organizerIds = organizersResult.map(({ OrganizationUser }) => OrganizationUser.userId)

    if (!organization) {
      throw new OrganizationNotFound(id.value)
    }

    return AstroOrganizationMapper.toDomain({ ...organization, location: province?.name ?? null }, organizerIds)
  }

  private async _updateOrganization(value: OrganizationEntity) {
    try {
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
    } catch (error) {
      this._mapError(error, value)
    }
  }

  private async _insertOrganization(value: OrganizationEntity) {
    try {
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
    } catch (error) {
      this._mapError(error, value)
    }
  }

  _mapError(error: unknown, organization: OrganizationEntity) {
    if (isDbError(error)) {
      switch (error.code) {
        case 'SQLITE_CONSTRAINT_UNIQUE':
          throw new OrganizationAlreadyExists(organization.handle)
        default:
          throw error
      }
    }

    throw error
  }
}
