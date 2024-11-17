import type { AuthenticationRepository } from '@/authentication/domain/authentication.repository'
import { LoggedUser } from '@/authentication/domain/logged-user'
import type { LoggedUserFilters } from '@/authentication/domain/logged-user-filters'
import type { LoggedUserId } from '@/authentication/domain/logged-user-id'
import { User, db, eq } from 'astro:db'
import { v4 as uuidv4 } from 'uuid'

export class AstroDbAuthenticationRepository implements AuthenticationRepository {
  async getLoggedUser(filters: LoggedUserFilters): Promise<LoggedUser | null> {
    const users = await db
      .select()
      .from(User)
      //@ts-expect-error
      .where(...this.getLoggedUserQuery(filters))

    const user = users.at(0)
    if (!user) {
      return null
    }

    return new LoggedUser({
      id: user.id,
      githubId: user.githubId || undefined,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    })
  }

  private getLoggedUserQuery(loggedUserFilters: LoggedUserFilters) {
    const filters = []

    if (loggedUserFilters.githubId) {
      filters.push(eq(User.githubId, loggedUserFilters.githubId))
    }

    if (loggedUserFilters.googleId) {
      filters.push(eq(User.googleId, loggedUserFilters.googleId))
    }

    return filters
  }

  async createLoggedUser(user: LoggedUser): Promise<void> {
    await db.insert(User).values([
      {
        id: user.id,
        githubId: user.githubId,
        googleId: user.googleId,
        name: user.name,
        username: user.username,
        email: user.email ?? undefined,
        avatar: user.avatar,
      },
    ])
  }

  generateId(): string {
    return uuidv4()
  }

  async deleteLoggedUser(userId: LoggedUserId): Promise<void> {
    await db.delete(User).where(eq(User.id, userId.value))
    return
  }
}
