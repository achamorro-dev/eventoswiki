import type { Province } from './province'

export class ProvinceCollection {
  constructor(private readonly provinces: Province[]) {}

  slugWithName(name?: string): string | undefined {
    if (!name) return undefined

    return this.provinces.find(province => province.name === name)?.slug
  }
}
