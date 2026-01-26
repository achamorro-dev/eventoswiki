'use client'

import { actions } from 'astro:actions'
import { Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { FeatureRequestStatus } from '@/modules/feature-requests/domain/feature-request'
import { Button } from '@/ui/button'

interface Props {
  featureRequestId: string
  currentStatus: FeatureRequestStatus
}

export default function FeatureRequestCancelButton({ featureRequestId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (currentStatus === FeatureRequestStatus.REJECTED) return

    setLoading(true)

    try {
      const { error } = await actions.featureRequests.updateFeatureRequestStatusAction({
        featureRequestId,
        status: FeatureRequestStatus.REJECTED,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Solicitud cancelada')
      window.location.reload()
    } catch (_error) {
      toast.error('Error al cancelar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCancel}
      disabled={loading || currentStatus === FeatureRequestStatus.REJECTED}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
      Cancelar
    </Button>
  )
}
