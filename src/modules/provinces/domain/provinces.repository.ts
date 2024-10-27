import type { FindableAllRepository } from '@/shared/domain/repository/findable-all-repository'
import type { FindableByIdOrNullRepository } from '@/shared/domain/repository/findable-by-id-or-null-repository'
import type { Province } from './province'

export interface ProvincesRepository
  extends FindableAllRepository<Province>,
    FindableByIdOrNullRepository<Province['slug'], Province> {}
