import { Datetime } from '@/shared/domain/datetime/datetime'
import type { OteAttendanceMode, OteEvent, OteStatus } from './ote-event'

/**
 * Serializa un documento OTE como JSON-LD de schema.org/Event, que es lo que
 * consumen los buscadores. La propia especificación de OTE publica esta tabla de
 * equivalencias; aquí se aplica sobre la representación intermedia para que el
 * feed y los datos estructurados de la página no puedan contradecirse.
 */
export function oteEventToJsonLd(event: OteEvent): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': event.id,
    name: event.name,
    // schema.org no admite una hora de pared suelta: hay que añadir el offset.
    startDate: Datetime.toZonedOffsetString(event.startDate, event.timezone),
    eventStatus: toEventStatus(event.status),
  }

  if (event.endDate) jsonLd.endDate = Datetime.toZonedOffsetString(event.endDate, event.timezone)
  if (event.description) jsonLd.description = event.description
  if (event.url) jsonLd.url = event.url
  if (event.textLanguage) jsonLd.inLanguage = event.textLanguage
  if (event.image?.length) jsonLd.image = event.image.map(image => image.url)
  if (event.tags?.length) jsonLd.keywords = event.tags.join(', ')
  if (event.attendanceMode) jsonLd.eventAttendanceMode = toAttendanceMode(event.attendanceMode)

  const location = toLocation(event)
  if (location) jsonLd.location = location

  if (event.organizers?.length) {
    jsonLd.organizer = event.organizers.map(organizer => ({
      '@type': organizer.type === 'person' ? 'Person' : 'Organization',
      name: organizer.name,
      ...(organizer.url ? { url: organizer.url } : {}),
    }))
  }

  if (event.offers?.length) {
    jsonLd.offers = event.offers.map(offer => ({
      '@type': 'Offer',
      name: offer.name,
      ...(offer.price !== undefined ? { price: offer.price } : {}),
      ...(offer.price !== undefined ? { priceCurrency: offer.currency ?? 'EUR' } : {}),
      ...(offer.url || event.url ? { url: offer.url ?? event.url } : {}),
      availability: offer.availability === 'sold-out' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    }))
  }

  return jsonLd
}

function toAttendanceMode(mode: OteAttendanceMode): string {
  switch (mode) {
    case 'online':
      return 'https://schema.org/OnlineEventAttendanceMode'
    case 'hybrid':
      return 'https://schema.org/MixedEventAttendanceMode'
    default:
      return 'https://schema.org/OfflineEventAttendanceMode'
  }
}

function toEventStatus(status: OteStatus = 'scheduled'): string {
  switch (status) {
    case 'cancelled':
      return 'https://schema.org/EventCancelled'
    case 'postponed':
      return 'https://schema.org/EventPostponed'
    case 'rescheduled':
      return 'https://schema.org/EventRescheduled'
    case 'moved-online':
      return 'https://schema.org/EventMovedOnline'
    default:
      return 'https://schema.org/EventScheduled'
  }
}

/**
 * Un evento híbrido devuelve las dos ubicaciones, que es como schema.org espera
 * que se represente.
 */
function toLocation(event: OteEvent): unknown {
  const { location } = event
  if (!location) return undefined

  const locations: unknown[] = []

  if (location.venue) {
    locations.push({
      '@type': 'Place',
      name: location.venue,
      ...(location.address
        ? {
            address: {
              '@type': 'PostalAddress',
              ...(location.address.street ? { streetAddress: location.address.street } : {}),
              ...(location.address.locality ? { addressLocality: location.address.locality } : {}),
              ...(location.address.region ? { addressRegion: location.address.region } : {}),
              ...(location.address.postalCode ? { postalCode: location.address.postalCode } : {}),
              ...(location.address.country ? { addressCountry: location.address.country } : {}),
            },
          }
        : {}),
      ...(location.geo
        ? { geo: { '@type': 'GeoCoordinates', latitude: location.geo.lat, longitude: location.geo.lon } }
        : {}),
    })
  }

  if (location.onlineUrl) {
    locations.push({ '@type': 'VirtualLocation', url: location.onlineUrl })
  }

  if (locations.length === 0) return undefined

  return locations.length === 1 ? locations[0] : locations
}
