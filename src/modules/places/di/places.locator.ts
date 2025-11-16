import { SearchPlacesQuery } from '../application/search-places.query'
import { GooglePlacesRepository } from '../infrastructure/google-places.repository'

export class PlacesLocator {
  static readonly searchPlacesQuery = new SearchPlacesQuery(new GooglePlacesRepository())
}
