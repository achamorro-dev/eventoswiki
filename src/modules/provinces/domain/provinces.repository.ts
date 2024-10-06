import type { FindableAllRepository } from '@/shared/domain/repository/findable-all-repository'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository'
import type { Province } from './province'

export interface ProvincesRepository
  extends FindableAllRepository<Province>,
    FindableByIdRepository<Province['slug'], Province> {}
