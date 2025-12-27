import type { LoggedUser } from './logged-user'
import type { LoggedUserFilters } from './logged-user-filters'
import type { LoggedUserId } from './logged-user-id'

export abstract class AuthenticationRepository {
  abstract getLoggedUser(filters: LoggedUserFilters): Promise<LoggedUser | null>
  abstract createLoggedUser(user: LoggedUser): Promise<void>
  abstract deleteLoggedUser(userId: LoggedUserId): Promise<void>
  abstract generateId(): string
}
