import type { FindableAllRepository } from '@/shared/domain/repository/findable-all-repository'
import type { FindableByIdOrNullRepository } from '@/shared/domain/repository/findable-by-id-or-null-repository'
import type { Province } from './province'

export abstract class ProvincesRepository
  implements FindableAllRepository<Province>, FindableByIdOrNullRepository<Province['slug'], Province>
{
  abstract findAll(): Promise<Array<Province>>
  abstract find(id: Province['slug']): Promise<Province | null>
}
