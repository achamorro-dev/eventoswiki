export interface AstroDbAgendaItemDto {
  id: string
  eventId: string
  type: string
  title: string
  description: string | null
  startsAt: Date
  endsAt: Date
  order: number
  createdAt: Date
  updatedAt: Date
}
