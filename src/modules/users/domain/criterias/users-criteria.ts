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
}
