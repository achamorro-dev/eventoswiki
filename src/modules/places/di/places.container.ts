import { ContainerBuilder } from 'diod'
import { SearchPlacesQuery } from '../application/search-places.query'
import { PlacesRepository } from '../domain/places.repository'
import { GooglePlacesRepository } from '../infrastructure/google-places.repository'

const builder = new ContainerBuilder()
builder.register(PlacesRepository).use(GooglePlacesRepository)
builder.register(SearchPlacesQuery).use(SearchPlacesQuery).withDependencies([PlacesRepository])

export const PlacesContainer = builder.build({ autowire: false })
