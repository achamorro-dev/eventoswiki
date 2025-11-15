import { GetProvinceQuery } from '../application/get-province.query'
import { GetProvincesQuery } from '../application/get-provinces.query'
import type { ProvincesRepository } from '../domain/provinces.repository'
import { AstroDbProvincesRepository } from '../infrastructure/astro-db-provinces.repository'

export class ProvincesLocator {
  private static createEventsRepository(): ProvincesRepository {
    return new AstroDbProvincesRepository()
  }

  static getProvincesQuery() {
    return new GetProvincesQuery(ProvincesLocator.createEventsRepository())
  }

  static getProvinceQuery() {
    return new GetProvinceQuery(ProvincesLocator.createEventsRepository())
  }
}
