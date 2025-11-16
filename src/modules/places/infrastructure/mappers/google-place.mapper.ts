import { Place } from '../../domain/place'
import type { GooglePlaceDto } from '../dtos/google-place.dto'

export class GooglePlaceMapper {
  static toDomainList(places: GooglePlaceDto[]): Place[] {
    return places.map(GooglePlaceMapper.toDomain())
  }

  private static toDomain(): (value: GooglePlaceDto, index: number, array: GooglePlaceDto[]) => Place {
    return (place: GooglePlaceDto) =>
      Place.fromPrimitives({
        id: place.id,
        name: place.displayName.text,
        address: place.formattedAddress,
      })
  }
}
