'use client'

import { FeatureRequestStatus } from '@/modules/feature-requests/domain/feature-request'
import { Badge } from '@/ui/badge'

interface Props {
  status: FeatureRequestStatus
}

const statusColors: Record<FeatureRequestStatus, 'success' | 'secondary' | 'destructive' | 'outline'> = {
  [FeatureRequestStatus.PENDING]: 'outline',
  [FeatureRequestStatus.IN_PROGRESS]: 'secondary',
  [FeatureRequestStatus.COMPLETED]: 'success',
  [FeatureRequestStatus.REJECTED]: 'destructive',
}

const statusLabels: Record<FeatureRequestStatus, string> = {
  [FeatureRequestStatus.PENDING]: 'Pendiente',
  [FeatureRequestStatus.IN_PROGRESS]: 'En Progreso',
  [FeatureRequestStatus.COMPLETED]: 'Completada',
  [FeatureRequestStatus.REJECTED]: 'Rechazada',
}

export default function FeatureRequestStatusBadge({ status }: Props) {
  return <Badge variant={statusColors[status]}>{statusLabels[status]}</Badge>
}
