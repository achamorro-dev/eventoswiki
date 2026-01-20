import { Criteria } from '@/shared/domain/criteria/criteria'
import { RelationalOperator } from '@/shared/domain/criteria/relational-operator'
import type { UsersFilters } from './users-filters'
import type { UsersOrder } from './users-order'

export class UsersCriteria extends Criteria<Partial<UsersFilters>, Partial<UsersOrder>> {
  static create(order?: Partial<UsersOrder>): UsersCriteria {
    return new UsersCriteria(order)
  }

  withEmail(email?: string): UsersCriteria {
    if (!email) return this

    this.and({ email: { operator: RelationalOperator.EQUALS, value: email } })
    return this
  }

  withUsername(username?: string): UsersCriteria {
    if (!username) return this

    this.and({ username: { operator: RelationalOperator.EQUALS, value: username } })
    return this
  }

  withIds(userIds?: string[]): UsersCriteria {
    if (!userIds || userIds.length === 0) return this

    const idFilters = userIds.map(id => ({
      id: { operator: RelationalOperator.EQUALS, value: id },
    }))
    // @ts-expect-error - Known issue with filter typing
    this.or(idFilters)
    return this
  }

  withSearch(query: string): UsersCriteria {
    if (!query) return this

    const searchPattern = `%${query.replace(/\s+/g, '%')}%`
    const searchFilters = [
      { name: { operator: RelationalOperator.LIKE, value: searchPattern } },
      { username: { operator: RelationalOperator.LIKE, value: searchPattern } },
      { email: { operator: RelationalOperator.LIKE, value: searchPattern } },
    ] as const
    // @ts-expect-error - Known issue with filter typing
    this.or(searchFilters)
    return this
  }

  withExcludeIds(userIds?: string[]): UsersCriteria {
    if (!userIds || userIds.length === 0) return this

    for (const id of userIds) {
      this.and({ id: { operator: RelationalOperator.NOT_EQUALS, value: id } })
    }
    return this
  }
}
