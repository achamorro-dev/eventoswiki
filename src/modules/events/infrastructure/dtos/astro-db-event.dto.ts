import type { Place } from '@/modules/places/domain/place'
import type { Primitives } from '@/shared/domain/primitives/primitives'

export interface AstroDbEventDto {
  id: string | null
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  image: string
  type: string
  location: string | null
  web: string | null
  twitter: string | null
  linkedin: string | null
  youtube: string | null
  twitch: string | null
  facebook: string | null
  instagram: string | null
  github: string | null
  telegram: string | null
  whatsapp: string | null
  discord: string | null
  tiktok: string | null
  streamingUrl: string | null
  tags: string
  tagColor: string
  createdAt: Date
  updatedAt: Date
  content: string
  organizationId: string | null
  place: Primitives<Place> | null | undefined
}

export interface AstroDbTicketDto {
  id: string
  eventId: string
  name: string
  price: number
  createdAt: Date
  updatedAt: Date
}
