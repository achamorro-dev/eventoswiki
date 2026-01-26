'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { useState } from 'react'
import { toast } from 'sonner'
import { FeatureRequestStatus } from '@/modules/feature-requests/domain/feature-request'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Urls } from '@/ui/urls/urls'

interface Props {
  featureRequestId: string
  currentStatus: FeatureRequestStatus
}

export default function FeatureRequestStatusSelect({ featureRequestId, currentStatus }: Props) {
  const [status, setStatus] = useState<FeatureRequestStatus>(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleValueChange = async (value: string) => {
    const newStatus = value as FeatureRequestStatus
    setStatus(newStatus)
    setLoading(true)

    try {
      const { error } = await actions.featureRequests.updateFeatureRequestStatusAction({
        featureRequestId,
        status: newStatus,
      })

      if (error) {
        toast.error(error.message)
        setStatus(currentStatus)
        return
      }

      toast.success('Estado actualizado')
      navigate(Urls.FEATURE_REQUEST_DETAILS(featureRequestId), { history: 'replace' })
    } catch (_error) {
      toast.error('Error al actualizar estado')
      setStatus(currentStatus)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-sm">Estado:</span>
      <Select value={status} onValueChange={handleValueChange} disabled={loading}>
        <SelectTrigger size="default" className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FeatureRequestStatus.PENDING}>Pendiente</SelectItem>
          <SelectItem value={FeatureRequestStatus.IN_PROGRESS}>En Progreso</SelectItem>
          <SelectItem value={FeatureRequestStatus.COMPLETED}>Completada</SelectItem>
          <SelectItem value={FeatureRequestStatus.REJECTED}>Rechazada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
