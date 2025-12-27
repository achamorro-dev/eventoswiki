import type { Place } from './place'

export abstract class PlacesRepository {
  abstract search(query: string): Promise<Array<Place>>
}
