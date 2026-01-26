import { z } from 'zod'

export const createBugActionSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  isPrivate: z.boolean().default(false),
})
