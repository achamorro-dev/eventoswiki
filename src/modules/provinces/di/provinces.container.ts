import { ContainerBuilder } from 'diod'
import { GetProvinceQuery } from '../application/get-province.query'
import { GetProvincesQuery } from '../application/get-provinces.query'
import { ProvincesRepository } from '../domain/provinces.repository'
import { AstroDbProvincesRepository } from '../infrastructure/astro-db-provinces.repository'

const builder = new ContainerBuilder()
builder.register(ProvincesRepository).use(AstroDbProvincesRepository)
builder.register(GetProvincesQuery).use(GetProvincesQuery).withDependencies([ProvincesRepository])
builder.register(GetProvinceQuery).use(GetProvinceQuery).withDependencies([ProvincesRepository])

export const ProvincesContainer = builder.build({ autowire: false })
