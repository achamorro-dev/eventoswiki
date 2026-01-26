'use client'

import { BugStatus } from '@/modules/bugs/domain/bug'
import { Badge } from '@/ui/badge'

interface Props {
  status: BugStatus
}

const statusColors: Record<BugStatus, 'success' | 'secondary' | 'destructive' | 'outline' | 'default'> = {
  [BugStatus.OPEN]: 'destructive',
  [BugStatus.IN_REVIEW]: 'default',
  [BugStatus.FIXED]: 'success',
  [BugStatus.CANCELED]: 'outline',
}

const statusLabels: Record<BugStatus, string> = {
  [BugStatus.OPEN]: 'Abierto',
  [BugStatus.IN_REVIEW]: 'En Revisión',
  [BugStatus.FIXED]: 'Corregido',
  [BugStatus.CANCELED]: 'Cancelado',
}

export default function BugStatusBadge({ status }: Props) {
  return <Badge variant={statusColors[status]}>{statusLabels[status]}</Badge>
}
