import { db, eq, User as UserTable } from 'astro:db'
import { v4 as uuidv4 } from 'uuid'
import type { AuthenticationRepository } from '@/authentication/domain/authentication.repository'
import { LoggedUser } from '@/authentication/domain/logged-user'
import type { LoggedUserFilters } from '@/authentication/domain/logged-user-filters'
import type { LoggedUserId } from '@/authentication/domain/logged-user-id'

export class AstroDbAuthenticationRepository implements AuthenticationRepository {
  async getLoggedUser(filters: LoggedUserFilters): Promise<LoggedUser | null> {
    const users = await db
      .select()
      .from(UserTable)
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
      avatar: user.avatar ?? '',
    })
  }

  private getLoggedUserQuery(loggedUserFilters: LoggedUserFilters) {
    const filters = []

    if (loggedUserFilters.githubId) {
      filters.push(eq(UserTable.githubId, loggedUserFilters.githubId))
    }

    if (loggedUserFilters.googleId) {
      filters.push(eq(UserTable.googleId, loggedUserFilters.googleId))
    }

    return filters
  }

  async createLoggedUser(user: LoggedUser): Promise<void> {
    await db.insert(UserTable).values({
      id: user.id,
      name: user.name,
      username: user.username,
      githubId: user.githubId,
      googleId: user.googleId,
      twitterId: user.twitterId,
      email: user.email,
      avatar: user.avatar,
    })
  }

  generateId(): string {
    return uuidv4()
  }

  async deleteLoggedUser(userId: LoggedUserId): Promise<void> {
    await db.delete(UserTable).where(eq(UserTable.id, userId.value))
    return
  }
}
