import { GetUserQuery } from '../application/get-user.query'
import type { UsersRepository } from '../domain/users.repository'
import { AstroDbUsersRepository } from '../infrastructure/astro-db-users.repository'

export class UsersLocator {
  static getUserRepository(): UsersRepository {
    return new AstroDbUsersRepository()
  }

  static getUserQuery(): GetUserQuery {
    return new GetUserQuery(UsersLocator.getUserRepository())
  }
}
