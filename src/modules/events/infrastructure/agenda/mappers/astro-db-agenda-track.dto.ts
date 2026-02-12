export interface AstroDbAgendaTrackDto {
  id: string
  eventId: string
  name: string
  description: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}
