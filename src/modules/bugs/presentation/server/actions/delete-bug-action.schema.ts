import { z } from 'zod'

export const deleteBugActionSchema = z.object({
  bugId: z.string(),
})
