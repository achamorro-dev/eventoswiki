import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository'
import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { User } from './user'
import type { UserId } from './user-id'

export interface UsersRepository extends FindableByIdRepository<UserId, User>, SaveableRepository<User> {}
