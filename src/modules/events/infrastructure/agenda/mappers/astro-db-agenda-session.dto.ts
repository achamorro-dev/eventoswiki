export interface AstroDbAgendaSessionDto {
  id: string
  trackId: string
  title: string
  description: string
  image: string | null
  categories: string | null
  language: string | null
  startsAt: Date
  endsAt: Date
  order: number
  createdAt: Date
  updatedAt: Date
}
