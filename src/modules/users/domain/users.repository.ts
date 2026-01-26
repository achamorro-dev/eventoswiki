import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository'
import type { MatcheableRepository } from '@/shared/domain/repository/matcheable-repository'
import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { UsersCriteria } from './criterias/users-criteria'
import type { UsersFilters } from './criterias/users-filters'
import type { UsersOrder } from './criterias/users-order'
import type { User } from './user'
import type { UserId } from './user-id'

export interface UsersRepository
  extends FindableByIdRepository<UserId, User>,
    SaveableRepository<User>,
    MatcheableRepository<Partial<UsersFilters>, Partial<UsersOrder>, UsersCriteria, User> {
  isAdmin(email: string): Promise<boolean>
}
