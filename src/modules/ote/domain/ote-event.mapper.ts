import type { Event } from '@/events/domain/event'
import { EventTypes } from '@/events/domain/event-type'
import { Meetup } from '@/meetups/domain/meetup'
import type { Organization } from '@/organizations/domain/organization'
import { Datetime } from '@/shared/domain/datetime/datetime'
import type {
  OteAttendanceMode,
  OteCfp,
  OteEvent,
  OteImage,
  OteLocation,
  OteOffer,
  OteOrganizer,
  OteSource,
} from './ote-event'
import { OteUrls } from './ote-urls'
import { timezoneForProvince } from './province-timezone'

/** Imagen de relleno que el sync de Meetup.com pone cuando el evento no trae ninguna */
const PLACEHOLDER_IMAGE = 'https://eventos.wiki/og.jpg'
const MAX_ALT_LENGTH = 250
const CURRENCY = 'EUR'
const TEXT_LANGUAGE = 'es'

/**
 * Traduce un evento o meetup del dominio a un documento OTE v0.3.
 *
 * Es la representación intermedia canónica: de aquí salen tanto el feed
 * (`/events.json`) como el JSON-LD de schema.org que se inyecta en las páginas
 * de detalle, de modo que ambos salidas no puedan divergir.
 */
export function toOteEvent(event: Event | Meetup, organization?: Organization): OteEvent {
  const isMeetup = event instanceof Meetup
  const timezone = timezoneForProvince(event.location)

  const id = isMeetup ? OteUrls.MEETUP_ID(event.id.value) : OteUrls.EVENT_ID(event.id.value)
  const url = isMeetup ? OteUrls.MEETUP(event.slug) : OteUrls.EVENT(event.slug)

  const oteEvent: OteEvent = {
    id,
    name: event.title,
    startDate: Datetime.toWallClockString(event.startsAt, timezone),
    endDate: Datetime.toWallClockString(event.endsAt, timezone),
    timezone,
    url,
    description: event.shortDescription || undefined,
    textLanguage: TEXT_LANGUAGE,
    attendanceMode: toAttendanceMode(event.type.value),
    // El dominio no modela cancelaciones todavía: todo lo publicado está programado.
    status: 'scheduled',
  }

  const image = toImage(event.image.toString(), event.title)
  if (image) oteEvent.image = [image]

  const tags = toTags(event.tags)
  if (tags.length > 0) oteEvent.tags = tags

  const location = toLocation(event)
  if (location) oteEvent.location = location

  const organizers = toOrganizers(organization)
  if (organizers) oteEvent.organizers = organizers

  if (isMeetup) {
    const source = toSource(event)
    if (source) oteEvent.source = source
  } else {
    const offers = toOffers(event)
    if (offers.length > 0) oteEvent.offers = offers

    const cfp = toCfp(event, url)
    if (cfp) oteEvent.cfp = cfp
  }

  return oteEvent
}

function toAttendanceMode(type: string): OteAttendanceMode {
  switch (type) {
    case EventTypes.Online:
      return 'online'
    case EventTypes.Hybrid:
      return 'hybrid'
    default:
      return 'in-person'
  }
}

function toImage(imageUrl: string, title: string): OteImage | undefined {
  if (!imageUrl || imageUrl === PLACEHOLDER_IMAGE) return undefined

  return {
    url: imageUrl,
    alt: `Cartel de ${title}`.slice(0, MAX_ALT_LENGTH),
  }
}

/** La spec rechaza etiquetas duplicadas (comparación exacta, sensible a mayúsculas) */
function toTags(tags: string[]): string[] {
  const normalized = tags.map(tag => tag.trim()).filter(tag => tag.length > 0)

  return [...new Set(normalized)]
}

/**
 * La spec exige `venue` u `onlineUrl`: sin ninguno de los dos el objeto entero
 * se omite. Cuando no hay sitio de Google Places pero sí provincia, se usa la
 * provincia como venue: es la única ubicación física conocida y perderla dejaría
 * el evento sin ubicación alguna.
 */
function toLocation(event: Event | Meetup): OteLocation | undefined {
  const place = event.place?.value
  const isOnline = event.type.value === EventTypes.Online
  const venue = place?.name || (isOnline ? undefined : event.location) || undefined
  const onlineUrl = event.type.value !== EventTypes.InPerson ? event.streamingUrl : undefined

  if (!venue && !onlineUrl) return undefined

  const location: OteLocation = {}
  if (venue) location.venue = venue
  if (onlineUrl) location.onlineUrl = onlineUrl

  if (venue) {
    location.address = {
      // `place.address` es el formattedAddress de Google, sin desglosar en calle/localidad.
      ...(place?.address ? { street: place.address } : {}),
      ...(event.location ? { region: event.location } : {}),
      country: 'ES',
    }
  }

  return location
}

export function toOteOrganizer(organization: Organization): OteOrganizer {
  return {
    name: organization.name,
    url: OteUrls.ORGANIZATION(organization.handle),
    type: 'organization',
  }
}

function toOrganizers(organization?: Organization): OteOrganizer[] | undefined {
  if (!organization) return undefined

  return [toOteOrganizer(organization)]
}

function toOffers(event: Event): OteOffer[] {
  return event.tickets.toPrimitives().map(({ name, price }) => ({
    name,
    price,
    // `currency` solo es obligatoria cuando hay importe; price 0 significa gratis.
    ...(price > 0 ? { currency: CURRENCY } : {}),
  }))
}

function toCfp(event: Event, eventUrl: string): OteCfp | undefined {
  if (!event.hasCallForSpeakers()) return undefined

  return {
    url: `${eventUrl}?tab=speakers`,
    // Los plazos sí son instantes absolutos, a diferencia de startDate/endDate.
    ...(event.callForSpeakersStartsAt ? { opensAt: Datetime.toInstantString(event.callForSpeakersStartsAt) } : {}),
    ...(event.callForSpeakersEndsAt ? { closesAt: Datetime.toInstantString(event.callForSpeakersEndsAt) } : {}),
  }
}

function toSource(meetup: Meetup): OteSource | undefined {
  if (!meetup.externalId) return undefined

  return {
    name: 'Meetup.com',
    ...(meetup.web ? { url: meetup.web } : {}),
  }
}
