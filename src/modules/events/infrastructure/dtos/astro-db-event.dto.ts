export interface AstroDbEventDto {
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  thumbnail: string
  image: string
  location: string | null
  web: string
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
  tags: string
  tagColor: string
  createdAt: Date
  updatedAt: Date
  content: string
}
