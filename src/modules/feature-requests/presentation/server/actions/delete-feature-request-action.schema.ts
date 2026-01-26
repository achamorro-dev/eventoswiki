import { z } from 'zod'

export const deleteFeatureRequestActionSchema = z.object({
  featureRequestId: z.string(),
})

export type DeleteFeatureRequestActionInput = z.infer<typeof deleteFeatureRequestActionSchema>
