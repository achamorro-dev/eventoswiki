'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { BugStatus } from '@/modules/bugs/domain/bug'
import { Button } from '@/ui/button'
import { Urls } from '@/ui/urls/urls'

interface Props {
  bugId: string
  currentStatus: BugStatus
}

export default function BugCancelButton({ bugId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (currentStatus === BugStatus.CANCELED) return

    setLoading(true)

    try {
      const { error } = await actions.bugs.updateBugStatusAction({
        bugId,
        status: BugStatus.CANCELED,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Bug cancelado')
      navigate(Urls.BUG_REPORT_DETAILS(bugId), { history: 'replace' })
    } catch (_error) {
      toast.error('Error al cancelar el bug')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCancel}
      disabled={loading || currentStatus === BugStatus.CANCELED}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
      Cancelar
    </Button>
  )
}
