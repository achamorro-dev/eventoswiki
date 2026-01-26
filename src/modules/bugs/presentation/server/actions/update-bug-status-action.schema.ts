import { z } from 'zod'
import { BugStatus } from '../../../domain/bug'

export const updateBugStatusActionSchema = z.object({
  bugId: z.string(),
  status: z.nativeEnum(BugStatus),
})
