import {
  and,
  asc,
  count,
  db,
  desc,
  Event,
  eq,
  inArray,
  isDbError,
  Meetup,
  Organization,
  OrganizationFollower,
  OrganizationUser,
  or,
  Province,
} from 'astro:db'
import type { Filter } from '@/shared/domain/criteria/filter'
import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'
import { FilterType } from '@/shared/domain/criteria/filter-type'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import type { OrganizationsCriteria } from '../domain/criterias/organizations-criteria'
import type { OrganizationsOrder } from '../domain/criterias/organizations-order'
import { OrganizationAlreadyExists } from '../domain/errors/organization-already-exists.error'
import { OrganizationNotFound } from '../domain/errors/organization-not-found.error'
import { Organization as OrganizationEntity } from '../domain/organization'
import type { OrganizationId } from '../domain/organization-id'
import type { OrganizationsRepository } from '../domain/organizations.repository'
import { AstroOrganizationMapper } from './mappers/astro-db-organization.mapper'

export class AstroDbOrganizationsRepository implements OrganizationsRepository {
  async findOrganizationsByUserId(userId: string): Promise<OrganizationEntity[]> {
    const result = await db
      .select({ Organization, Province })
      .from(Organization)
      .leftJoin(Province, eq(Province.slug, Organization.location))
      .innerJoin(OrganizationUser, eq(Organization.id, OrganizationUser.organizationId))
      .where(eq(OrganizationUser.userId, userId))

    const organizationIds = result.map(({ Organization }) => Organization.id)
    const followersResult = await this.getFollowersMapByOrganizationIds(organizationIds)

    return result.map(({ Organization, Province }) =>
      AstroOrganizationMapper.toDomain({
        organization: Organization,
        province: Province,
        organizerIds: [],
        followerIds: followersResult.get(Organization.id) ?? [],
      }),
    )
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

    const followersResult = await db
      .select()
      .from(OrganizationFollower)
      .innerJoin(Organization, eq(OrganizationFollower.organizationId, Organization.id))
      .where(eq(Organization.handle, handle))

    const organization = organizationResult.at(0)?.Organization
    const province = organizationResult.at(0)?.Province
    const organizerIds = organizersResult.map(({ OrganizationUser }) => OrganizationUser.userId)
    const followerIds = followersResult.map(({ OrganizationFollower }) => OrganizationFollower.userId)

    if (!organization) {
      throw new OrganizationNotFound(handle)
    }

    return AstroOrganizationMapper.toDomain({ organization, organizerIds, followerIds, province })
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

    const followersResult = await db
      .select()
      .from(OrganizationFollower)
      .innerJoin(Organization, eq(OrganizationFollower.organizationId, Organization.id))
      .where(eq(Organization.id, id.value))

    const organization = organizationResult.at(0)?.Organization
    const province = organizationResult.at(0)?.Province
    const organizerIds = organizersResult.map(({ OrganizationUser }) => OrganizationUser.userId)
    const followerIds = followersResult.map(({ OrganizationFollower }) => OrganizationFollower.userId)

    if (!organization) {
      throw new OrganizationNotFound(id.value)
    }

    return AstroOrganizationMapper.toDomain({ organization, organizerIds, followerIds, province })
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

  async delete(id: OrganizationId): Promise<void> {
    try {
      await db.delete(Event).where(eq(Event.organizationId, id.value))
      await db.delete(Meetup).where(eq(Meetup.organizationId, id.value))
      await db.delete(OrganizationUser).where(eq(OrganizationUser.organizationId, id.value))
      await db.delete(Organization).where(eq(Organization.id, id.value))
    } catch (_error) {
      throw new OrganizationNotFound(id.value)
    }
  }

  async updateFollowers(organization: OrganizationEntity): Promise<void> {
    try {
      const existingFollowers = await db
        .select()
        .from(OrganizationFollower)
        .where(eq(OrganizationFollower.organizationId, organization.id.value))

      const followersToDelete = existingFollowers.filter(follower => !organization.followers.includes(follower.userId))
      const followersToInsert = organization.followers.filter(
        follower => !existingFollowers.some(f => f.userId === follower),
      )

      if (followersToDelete.length > 0) {
        await db.delete(OrganizationFollower).where(
          inArray(
            OrganizationFollower.userId,
            followersToDelete.map(f => f.userId),
          ),
        )
      }

      if (followersToInsert.length > 0) {
        await db.insert(OrganizationFollower).values(
          followersToInsert.map(follower => ({
            organizationId: organization.id.value,
            userId: follower,
          })),
        )
      }
    } catch (error) {
      this._mapError(error, organization)
    }
  }

  async findOrganizationsFollowedByUserId(userId: string): Promise<OrganizationEntity[]> {
    const result = await db
      .select({ Organization, Province })
      .from(Organization)
      .leftJoin(Province, eq(Province.slug, Organization.location))
      .innerJoin(OrganizationFollower, eq(Organization.id, OrganizationFollower.organizationId))
      .where(eq(OrganizationFollower.userId, userId))
    const organizationIds = result.map(({ Organization }) => Organization.id)
    const followersResult = await this.getFollowersMapByOrganizationIds(organizationIds)

    return result.map(({ Organization, Province }) =>
      AstroOrganizationMapper.toDomain({
        organization: Organization,
        province: Province,
        organizerIds: [],
        followerIds: followersResult.get(Organization.id) ?? [],
      }),
    )
  }

  async match(criteria: OrganizationsCriteria): Promise<PaginatedResult<OrganizationEntity>> {
    const organizationsQuery = this.getOrganizationsQueryWithCriteria(criteria).orderBy(
      ...this.getOrderBy(criteria.order),
    )
    const countQuery = this.getCountOrganizationsQueryWithCriteria(criteria)

    if (criteria.limit) {
      organizationsQuery.limit(criteria.limit)
    }

    if (criteria.page) {
      organizationsQuery.offset(criteria.offset)
    }

    const organizations = await organizationsQuery
    const organizationIds = organizations.map(({ Organization }) => Organization.id)
    const followersMap = await this.getFollowersMapByOrganizationIds(organizationIds)
    const count = await countQuery
    const totalPages = Math.ceil(count[0].count / criteria.limit)

    const organizationsWithFollowers = organizations.map(({ Organization, Province }) =>
      AstroOrganizationMapper.toDomain({
        organization: Organization,
        organizerIds: [],
        followerIds: followersMap.get(Organization.id) ?? [],
        province: Province,
      }),
    )

    return new PaginatedResult(organizationsWithFollowers, totalPages, criteria.page, criteria.limit)
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

  private getOrganizationsQueryWithCriteria(criteria: OrganizationsCriteria) {
    return (
      db
        .select({ Organization, Province })
        .from(Organization)
        .leftJoin(Province, eq(Province.slug, Organization.location))
        //@ts-expect-error
        .where(...this.getOrganizationsFiltersByCriteria(criteria))
    )
  }

  private getCountOrganizationsQueryWithCriteria(criteria: OrganizationsCriteria) {
    return (
      db
        .select({ count: count() })
        .from(Organization)
        .leftJoin(Province, eq(Province.slug, Organization.location))
        //@ts-expect-error
        .where(...this.getOrganizationsFiltersByCriteria(criteria))
    )
  }

  private getOrganizationsFiltersByCriteria(criteria: OrganizationsCriteria) {
    return this.getFiltersToApply(criteria.filters)
  }

  //@ts-expect-error return any, pending fix types
  private getFiltersToApply<F>(parentFilters: F | Array<Filter<F>>) {
    if (!parentFilters) return []

    if (Array.isArray(parentFilters)) {
      return parentFilters.map((parentFilter: Filter<F>) => {
        const { type, filters } = parentFilter
        //@ts-expect-error
        const criterias = this.getFiltersToApply(filters)
        return type === FilterType.AND ? and(...criterias) : or(...criterias)
      })
    }

    return (
      Object.entries<FilterCriteria | undefined>(parentFilters)
        .filter(([_, value]) => value !== undefined)
        // biome-ignore lint/suspicious/useIterableCallbackReturn: Known issue with typing
        .map(([key, filter]) => {
          if (!filter) return

          switch (filter.operator) {
            case RelationalOperator.EQUALS:
              //@ts-expect-error
              return eq(Organization[key], filter.value)
            case RelationalOperator.GREATER_THAN_OR_EQUAL:
              //@ts-expect-error
              return gte(Organization[key], filter.value)
            case RelationalOperator.LOWER_THAN_OR_EQUAL:
              //@ts-expect-error
              return lte(Organization[key], filter.value)
            case RelationalOperator.GREATER_THAN:
              //@ts-expect-error
              return gt(Organization[key], filter.value)
            case RelationalOperator.LOWER_THAN:
              //@ts-expect-error
              return lt(Organization[key], filter.value)
            case RelationalOperator.LIKE:
            case RelationalOperator.LIKE_NOT_SENSITIVE:
              //@ts-expect-error
              return like(Organization[key], filter.value)
            case RelationalOperator.NOT_EQUALS:
              //@ts-expect-error
              return ne(Organization[key], filter.value)
          }
        })
    )
  }

  private getOrderBy(order: Partial<OrganizationsOrder> | undefined) {
    const orderBy = []

    if (order?.name === OrderDirection.ASC) {
      orderBy.push(asc(Organization.name))
    }

    if (order?.name === OrderDirection.DESC) {
      orderBy.push(desc(Organization.name))
    }

    return orderBy
  }

  private async getFollowersMapByOrganizationIds(organizationIds: string[]) {
    if (organizationIds.length === 0) return new Map<string, string[]>()

    const followers = await db
      .select()
      .from(OrganizationFollower)
      .where(inArray(OrganizationFollower.organizationId, organizationIds))

    const map = new Map<string, string[]>()
    for (const follower of followers) {
      const list = map.get(follower.organizationId) ?? []
      list.push(follower.userId)
      map.set(follower.organizationId, list)
    }

    return map
  }
}
