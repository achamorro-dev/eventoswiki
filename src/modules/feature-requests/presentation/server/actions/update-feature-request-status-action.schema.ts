import { z } from 'zod'
import { FeatureRequestStatus } from '@/modules/feature-requests/domain/feature-request'

export const updateFeatureRequestStatusActionSchema = z.object({
  featureRequestId: z.string(),
  status: z.nativeEnum(FeatureRequestStatus),
})

export type UpdateFeatureRequestStatusActionInput = z.infer<typeof updateFeatureRequestStatusActionSchema>
