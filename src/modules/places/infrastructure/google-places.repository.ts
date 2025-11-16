import { GOOGLE_MAPS_PLACES_API_KEY } from 'astro:env/server'
import { Place } from '../domain/place'
import type { PlacesRepository } from '../domain/places.repository'
import type { GooglePlaceDto } from './dtos/google-place.dto'
import { GooglePlaceMapper } from './mappers/google-place.mapper'

export class GooglePlacesRepository implements PlacesRepository {
  async search(query: string): Promise<Array<Place>> {
    if (!GOOGLE_MAPS_PLACES_API_KEY) {
      throw new Error('API key de Google Maps no configurada')
    }

    const url = 'https://places.googleapis.com/v1/places:searchText'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'es',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error en la búsqueda: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()

    const places: GooglePlaceDto[] = data.places || []

    return GooglePlaceMapper.toDomainList(places)
  }
}
