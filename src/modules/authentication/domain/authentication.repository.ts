import type { LoggedUser } from './logged-user'
import type { LoggedUserFilters } from './logged-user-filters'

export interface AuthenticationRepository {
  getLoggedUser(filters: LoggedUserFilters): Promise<LoggedUser | null>
  createLoggedUser(user: LoggedUser): Promise<void>
  generateId(): string
}
