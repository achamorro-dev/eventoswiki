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
}
