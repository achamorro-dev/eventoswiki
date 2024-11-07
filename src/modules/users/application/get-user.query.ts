import { Query } from '@/shared/application/use-case/query'
import type { User } from '../domain/user'
import { UserId } from '../domain/user-id'
import type { UsersRepository } from '../domain/users.repository'

interface GetUserRequest {
  id: string
}
export class GetUserQuery extends Query<User, GetUserRequest> {
  constructor(private readonly usersRepository: UsersRepository) {
    super()
  }

  execute(param: GetUserRequest): Promise<User> {
    const userId = UserId.of(param.id)
    return this.usersRepository.find(userId)
  }
}
