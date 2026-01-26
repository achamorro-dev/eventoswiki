export interface AstroDbBugCommentDto {
  id: string
  bugId: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
  userName?: string
}
