import type { Filter } from '@/shared/domain/criteria/filter'
import type { FilterCriteria } from '@/shared/domain/criteria/filter-criteria'
import { FilterType } from '@/shared/domain/criteria/filter-type'
import { OrderDirection } from '@/shared/domain/criteria/order-direction'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { PaginatedResult as PaginatedResultImpl } from '@/shared/domain/criteria/paginated-result'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import { User as UserTable, and, asc, count, db, desc, eq, gt, gte, like, lt, lte, ne, or } from 'astro:db'
import type { UsersCriteria } from '../domain/criterias/users-criteria'
import type { UsersOrder } from '../domain/criterias/users-order'
import { UserNotFoundError } from '../domain/errors/user-not-found.error'
import { User } from '../domain/user'
import type { UserId } from '../domain/user-id'
import type { UsersRepository } from '../domain/users.repository'

export class AstroDbUsersRepository implements UsersRepository {
  async find(id: UserId): Promise<User> {
    const users = await db.select().from(UserTable).where(eq(UserTable.id, id.value))

    const user = users.at(0)
    if (!user) {
      throw new UserNotFoundError(id.value)
    }

    return User.fromPrimitives(user)
  }

  async save(user: User): Promise<void> {
    await db
      .update(UserTable)
      .set({
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.getAvatarUrlString(),
      })
      .where(eq(UserTable.id, user.id.value))
  }

  async match(criteria: UsersCriteria): Promise<PaginatedResult<User>> {
    const usersQuery = this.getUsersQueryWithCriteria(criteria).orderBy(...this.getOrderBy(criteria.order))
    const countQuery = this.getCountUsersQueryWithCriteria(criteria)

    if (criteria.limit) {
      usersQuery.limit(criteria.limit)
    }

    if (criteria.page) {
      usersQuery.offset(criteria.offset)
    }

    const users = await usersQuery
    const count = await countQuery
    const totalPages = Math.ceil(count[0].count / criteria.limit)

    const userEntities = users.map(user => User.fromPrimitives(user))
    return new PaginatedResultImpl(userEntities, totalPages, criteria.page, criteria.limit)
  }

  private getOrderBy(order: Partial<UsersOrder> | undefined) {
    const orderBy = []

    if (order?.createdAt === OrderDirection.ASC) {
      orderBy.push(asc(UserTable.createdAt))
    }

    if (order?.createdAt === OrderDirection.DESC) {
      orderBy.push(desc(UserTable.createdAt))
    }

    if (order?.username === OrderDirection.ASC) {
      orderBy.push(asc(UserTable.username))
    }

    if (order?.username === OrderDirection.DESC) {
      orderBy.push(desc(UserTable.username))
    }

    return orderBy
  }

  private getUsersQueryWithCriteria(criteria: UsersCriteria) {
    const filters = this.getUsersFiltersByCriteria(criteria)
    return db
      .select()
      .from(UserTable)
      .where(filters.length > 0 ? filters[0] : undefined)
  }

  private getCountUsersQueryWithCriteria(criteria: UsersCriteria) {
    const filters = this.getUsersFiltersByCriteria(criteria)
    return db
      .select({ count: count() })
      .from(UserTable)
      .where(filters.length > 0 ? filters[0] : undefined)
  }

  private getUsersFiltersByCriteria(criteria: UsersCriteria) {
    return this.getFiltersToApply(criteria.filters)
  }

  // @ts-expect-error - Known issue with return type
  private getFiltersToApply<F>(parentFilters: F | Array<Filter<F>>) {
    if (!parentFilters) return []

    if (Array.isArray(parentFilters)) {
      return parentFilters.map((parentFilter: Filter<F>) => {
        const { type, filters } = parentFilter
        // @ts-ignore - Known issue with recursive calls
        const criterias = this.getFiltersToApply(filters)
        return type === FilterType.AND ? and(...criterias) : or(...criterias)
      })
    }

    // @ts-ignore - Known issue with type casting
    return Object.entries<FilterCriteria | undefined>(parentFilters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, userFilter]) => {
        if (!userFilter) return

        switch (userFilter.operator) {
          case RelationalOperator.EQUALS:
            // @ts-ignore - Known issue with indexing
            return eq(UserTable[key], userFilter.value)
          case RelationalOperator.GREATER_THAN_OR_EQUAL:
            // @ts-ignore - Known issue with indexing
            return gte(UserTable[key], userFilter.value)
          case RelationalOperator.LOWER_THAN_OR_EQUAL:
            // @ts-ignore - Known issue with indexing
            return lte(UserTable[key], userFilter.value)
          case RelationalOperator.GREATER_THAN:
            // @ts-ignore - Known issue with indexing
            return gt(UserTable[key], userFilter.value)
          case RelationalOperator.LOWER_THAN:
            // @ts-ignore - Known issue with indexing
            return lt(UserTable[key], userFilter.value)
          case RelationalOperator.LIKE:
          case RelationalOperator.LIKE_NOT_SENSITIVE:
            // @ts-ignore - Known issue with indexing
            return like(UserTable[key], userFilter.value)
          case RelationalOperator.NOT_EQUALS:
            // @ts-ignore - Known issue with indexing
            return ne(UserTable[key], userFilter.value)
        }
      })
  }
}
