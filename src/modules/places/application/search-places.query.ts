import { Query } from '@/shared/application/use-case/query'
import type { Place } from '../domain/place'
import type { PlacesRepository } from '../domain/places.repository'

export class SearchPlacesQuery extends Query<Array<Place>, string> {
  constructor(private readonly placesRepository: PlacesRepository) {
    super()
  }

  async execute(query: string): Promise<Array<Place>> {
    return this.placesRepository.search(query)
  }
}
