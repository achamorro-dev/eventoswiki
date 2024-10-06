import { Query } from '@/shared/application/use-case/query'
import type { Province } from '../domain/province'
import type { ProvincesRepository } from '../domain/provinces.repository'

interface GetProvinceRequest {
  id: Province['slug']
}

export class GetProvinceQuery extends Query<Province, GetProvinceRequest> {
  constructor(private readonly provinceRepository: ProvincesRepository) {
    super()
  }

  execute({ id }: GetProvinceRequest): Promise<Province> {
    return this.provinceRepository.find(id)
  }
}
