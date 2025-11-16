import type { FC } from 'react'
import type { Place } from '@/modules/places/domain/place'
import { PlaceEmbedMap } from '@/modules/places/presentation/client/components/place-embed-map/place-embed-map'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Globe, MapPinLine } from '@/ui/icons'
import { EventDataRow } from '../event-data-row/event-data-row'

interface Props {
  location?: string | null
  place?: Primitives<Place>
}

export const EventLocation: FC<Props> = ({ location, place }) => {
  return (
    <>
      {location && !place && (
        <EventDataRow
          title="Localización"
          icon={<Globe />}
          value={location}
          ariaLabel={`Localización del evento: ${location}`}
        />
      )}
      {place && (
        <>
          <EventDataRow
            title={place.name}
            icon={<MapPinLine />}
            value={place.address}
            ariaLabel={`Nombre del lugar del evento ${place.name}, dirección: ${place.address}`}
          />
          <PlaceEmbedMap place={place} height="200px" className="mb-2" />
        </>
      )}
    </>
  )
}
