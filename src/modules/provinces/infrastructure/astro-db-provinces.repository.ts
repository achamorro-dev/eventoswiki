import { db, eq, Province } from 'astro:db'
import { Province as ProvinceEntity } from '../domain/province'
import type { ProvincesRepository } from '../domain/provinces.repository'

export class AstroDbProvincesRepository implements ProvincesRepository {
  async findAll(): Promise<Array<ProvinceEntity>> {
    const provinces = await db.select().from(Province).orderBy(Province.name)
    return provinces.map(ProvinceEntity.fromPrimitives)
  }

  async find(id: ProvinceEntity['slug']): Promise<ProvinceEntity | null> {
    const provinces = await db.select().from(Province).where(eq(Province.slug, id)).orderBy(Province.name)

    if (!provinces.length) {
      return null
    }

    return ProvinceEntity.fromPrimitives(provinces[0])
  }
}
