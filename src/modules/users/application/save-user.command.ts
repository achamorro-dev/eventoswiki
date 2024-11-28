import { Command } from '@/shared/application/use-case/command'
import { UserId } from '../domain/user-id'
import type { UsersRepository } from '../domain/users.repository'

interface Param {
  userId: string
  name: string
  email: string | null
  username: string
}
export class SaveUserCommand extends Command<Param, void> {
  constructor(private readonly usersRepository: UsersRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { userId, name, email, username } = param

    const user = await this.usersRepository.find(UserId.of(userId))
    user.updateProfile({ name, email, username })

    return this.usersRepository.save(user)
  }
}
