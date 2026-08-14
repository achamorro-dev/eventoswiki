/**
 * Tipos del formato OpenTechEvents (OTE) v0.3 — https://opentechevents.org
 *
 * La especificación está en draft (0.x) y avisa de que los campos pueden
 * cambiar, renombrarse o desaparecer. Por eso estos tipos viven aislados en su
 * propio módulo y nunca se filtran al dominio de events/meetups: son un formato
 * de serialización, no un modelo de dominio.
 */

export const OTE_SPEC_VERSION = '0.3.0'
export const OTE_LICENSE = 'CC-BY-4.0'
export const OTE_MEDIA_TYPE = 'application/ote+json'

export type OteAttendanceMode = 'in-person' | 'online' | 'hybrid'

export type OteStatus = 'scheduled' | 'tentative' | 'cancelled' | 'postponed' | 'rescheduled' | 'moved-online'

export interface OteAddress {
  street?: string
  locality?: string
  region?: string
  postalCode?: string
  /** ISO 3166-1 alpha-2 en mayúsculas */
  country?: string
}

export interface OteGeo {
  lat: number
  lon: number
}

/** La spec exige `venue` u `onlineUrl` (o ambos) */
export interface OteLocation {
  venue?: string
  address?: OteAddress
  geo?: OteGeo
  onlineUrl?: string
}

export interface OteOrganizer {
  name: string
  url?: string
  email?: string
  type?: 'organization' | 'person'
}

export interface OteImage {
  url: string
  /** Máximo 250 caracteres */
  alt?: string
}

export interface OteOffer {
  name: string
  price?: number
  /** ISO 4217; requerido si price > 0 */
  currency?: string
  url?: string
  availability?: 'in-stock' | 'sold-out'
  opensAt?: string
  closesAt?: string
}

export interface OteCfp {
  url?: string
  opensAt?: string
  closesAt?: string
  coversTravel?: boolean
  coversAccommodation?: boolean
}

export interface OteSource {
  name?: string
  url?: string
  license?: string
  retrievedAt?: string
}

export interface OteEvent {
  /** URL estable e inmutable; nunca cambia una vez publicada */
  id: string
  name: string
  /** Hora de pared sin offset: `YYYY-MM-DDTHH:mm` */
  startDate: string
  endDate?: string
  /** Identificador IANA */
  timezone: string
  url?: string
  description?: string
  image?: OteImage[]
  attendanceMode?: OteAttendanceMode
  location?: OteLocation
  organizers?: OteOrganizer[]
  tags?: string[]
  languages?: string[]
  textLanguage?: string
  status?: OteStatus
  offers?: OteOffer[]
  cfp?: OteCfp
  source?: OteSource
  updatedAt?: string
}

export interface OteFeed {
  specVersion: string
  license: string
  title?: string
  url?: string
  description?: string
  textLanguage?: string
  organizers?: OteOrganizer[]
  updatedAt?: string
  events: OteEvent[]
}
