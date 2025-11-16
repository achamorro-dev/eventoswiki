import type { Place } from './place'

export interface PlacesRepository {
  search(query: string): Promise<Array<Place>>
}
