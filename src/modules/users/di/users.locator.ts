import { GetUserQuery } from '../application/get-user.query'
import { SaveUserCommand } from '../application/save-user.command'
import type { UsersRepository } from '../domain/users.repository'
import { AstroDbUsersRepository } from '../infrastructure/astro-db-users.repository'

export class UsersLocator {
  static getUserRepository(): UsersRepository {
    return new AstroDbUsersRepository()
  }

  static getUserQuery(): GetUserQuery {
    return new GetUserQuery(UsersLocator.getUserRepository())
  }

  static saveProfileCommand() {
    return new SaveUserCommand(UsersLocator.getUserRepository())
  }

  static saveUserCommand() {
    return new SaveUserCommand(UsersLocator.getUserRepository())
  }
}
