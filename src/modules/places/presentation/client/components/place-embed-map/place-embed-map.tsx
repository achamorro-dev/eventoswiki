'use client'

import type { Place } from '@/modules/places/domain/place'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { cn } from '@/ui/lib/utils'

interface PlaceEmbedMapProps {
  place: Primitives<Place>
  height?: string | number
  className?: string
}

export function PlaceEmbedMap({ place, height = '400px', className }: PlaceEmbedMapProps) {
  const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_EMBED_API_KEY

  if (!place.id) {
    return null
  }

  if (!apiKey) {
    console.error('GOOGLE_MAPS_EMBED_API_KEY no está configurada')
    return null
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${place.id}`

  const heightValue = typeof height === 'number' ? `${height}px` : height

  return (
    <div className={cn('w-full overflow-hidden rounded-lg border border-border', className)}>
      <iframe
        src={embedUrl}
        width="100%"
        height={heightValue}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa de ${place.name || place.address}`}
      />
    </div>
  )
}
