import { Command } from '@/shared/application/use-case/command'
import { UserNotFoundError } from '../domain/errors/user-not-found.error'
import { UsernameAlreadyExistError } from '../domain/errors/username-already-exist.error'
import { UserId } from '../domain/user-id'
import type { UsersRepository } from '../domain/users.repository'
import type { GetUserByUsernameQuery } from './get-user-by-username.query'

interface Param {
  userId: string
  name: string
  email: string | null
  username: string
  avatar: string | null
}
export class SaveUserCommand extends Command<Param, void> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly getUserByUsernameQuery: GetUserByUsernameQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { userId, name, email, username, avatar } = param

    const user = await this.usersRepository.find(UserId.of(userId))
    await this.ensureUsernameIsAvailable(username, user.id)

    user.updateProfile({ name, email, username, avatar })
    return this.usersRepository.save(user)
  }

  private async ensureUsernameIsAvailable(username: string, originalUserId: UserId): Promise<void> {
    try {
      const user = await this.getUserByUsernameQuery.execute({ username })
      if (!user.id.equals(originalUserId)) {
        throw new UsernameAlreadyExistError(username)
      }
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return
      }

      throw error
    }
  }
}
