export interface AstroDbBugDto {
  id: string
  userId: string
  title: string
  description: string
  status: string
  visibility: string
  createdAt: Date
  updatedAt: Date
  userName?: string
}
