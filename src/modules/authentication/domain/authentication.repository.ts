import type { LoggedUser } from './logged-user'
import type { LoggedUserFilters } from './logged-user-filters'
import type { LoggedUserId } from './logged-user-id'

export interface AuthenticationRepository {
  getLoggedUser(filters: LoggedUserFilters): Promise<LoggedUser | null>
  createLoggedUser(user: LoggedUser): Promise<void>
  deleteLoggedUser(userId: LoggedUserId): Promise<void>
  generateId(): string
}
