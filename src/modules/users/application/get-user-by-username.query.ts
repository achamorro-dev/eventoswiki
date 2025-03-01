import { Query } from '@/shared/application/use-case/query'
import { UsersCriteria } from '../domain/criterias/users-criteria'
import { UserNotFoundError } from '../domain/errors/user-not-found.error'
import type { User } from '../domain/user'
import type { UsersRepository } from '../domain/users.repository'

interface GetUserByUsernameRequest {
  username: string
}

export class GetUserByUsernameQuery extends Query<User, GetUserByUsernameRequest> {
  constructor(private readonly usersRepository: UsersRepository) {
    super()
  }

  async execute(request: GetUserByUsernameRequest): Promise<User> {
    const { username } = request
    const criteria = UsersCriteria.create().withUsername(username)
    const users = await this.usersRepository.match(criteria)

    if (users.data.length === 0) {
      throw new UserNotFoundError(username)
    }

    return users.data[0]
  }
}
