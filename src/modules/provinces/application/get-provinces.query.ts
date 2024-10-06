import { Query } from '@/shared/application/use-case/query'
import type { Province } from '../domain/province'
import type { ProvincesRepository } from '../domain/provinces.repository'

export class GetProvincesQuery extends Query<Array<Province>> {
  constructor(private readonly provinceRepository: ProvincesRepository) {
    super()
  }

  execute(): Promise<Array<Province>> {
    return this.provinceRepository.findAll()
  }
}
