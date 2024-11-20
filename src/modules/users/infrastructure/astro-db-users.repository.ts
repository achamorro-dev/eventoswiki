import { db, eq, User as UserTable } from 'astro:db'
import { UserNotFoundError } from '../domain/errors/user-not-found.error'
import { User } from '../domain/user'
import type { UserId } from '../domain/user-id'
import type { UsersRepository } from '../domain/users.repository'

export class AstroDbUsersRepository implements UsersRepository {
  async find(id: UserId): Promise<User> {
    const users = await db.select().from(UserTable).where(eq(UserTable.id, id.value))

    const user = users.at(0)
    if (!user) {
      throw new UserNotFoundError(id.value)
    }

    return User.fromPrimitives(user)
  }

  async save(user: User): Promise<void> {
    await db
      .update(UserTable)
      .set({
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.getAvatarUrlString(),
      })
      .where(eq(UserTable.id, user.id.value))
  }
}
