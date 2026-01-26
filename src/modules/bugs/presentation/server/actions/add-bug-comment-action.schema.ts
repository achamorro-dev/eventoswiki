import { z } from 'zod'

export const addBugCommentActionSchema = z.object({
  bugId: z.string(),
  content: z.string().min(1, 'El comentario no puede estar vacío'),
})
