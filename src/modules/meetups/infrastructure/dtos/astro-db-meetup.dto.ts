export interface AstroDbMeetupDto {
  id: string | null
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  image: string
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
  tags: string
  tagColor: string
  createdAt: Date
  updatedAt: Date
  content: string
  organizationId: string | null
}
