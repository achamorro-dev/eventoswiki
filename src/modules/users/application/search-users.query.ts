import { Query } from '@/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { UsersCriteria } from '../domain/criterias/users-criteria'
import type { User } from '../domain/user'
import type { UsersRepository } from '../domain/users.repository'

interface SearchUsersRequest {
  query: string
  excludeUserIds?: string[]
  limit?: number
}

export class SearchUsersQuery extends Query<PaginatedResult<User>, SearchUsersRequest> {
  constructor(private readonly usersRepository: UsersRepository) {
    super()
  }

  async execute(request: SearchUsersRequest): Promise<PaginatedResult<User>> {
    const { query, excludeUserIds, limit = 10 } = request

    const criteria = UsersCriteria.create().withSearch(query).withLimit(limit)

    if (excludeUserIds && excludeUserIds.length > 0) {
      criteria.withExcludeIds(excludeUserIds)
    }

    return this.usersRepository.match(criteria)
  }
}
