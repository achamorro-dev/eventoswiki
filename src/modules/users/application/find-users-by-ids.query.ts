import { Query } from '@/shared/application/use-case/query'
import type { PaginatedResult } from '@/shared/domain/criteria/paginated-result'
import { UsersCriteria } from '../domain/criterias/users-criteria'
import type { User } from '../domain/user'
import type { UsersRepository } from '../domain/users.repository'

interface FindUsersByIdsRequest {
  userIds: string[]
  limit?: number
}

export class FindUsersByIdsQuery extends Query<PaginatedResult<User>, FindUsersByIdsRequest> {
  constructor(private readonly usersRepository: UsersRepository) {
    super()
  }

  execute(request: FindUsersByIdsRequest): Promise<PaginatedResult<User>> {
    const { userIds, limit } = request

    const criteria = UsersCriteria.create().withIds(userIds).withLimit(limit)

    return this.usersRepository.match(criteria)
  }
}
