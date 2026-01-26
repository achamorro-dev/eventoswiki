'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { useState } from 'react'
import { toast } from 'sonner'
import { BugStatus } from '@/modules/bugs/domain/bug'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Urls } from '@/ui/urls/urls'

interface Props {
  bugId: string
  currentStatus: BugStatus
}

export default function BugStatusSelect({ bugId, currentStatus }: Props) {
  const [status, setStatus] = useState<BugStatus>(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleValueChange = async (value: string) => {
    const newStatus = value as BugStatus
    setStatus(newStatus)
    setLoading(true)

    try {
      const { error } = await actions.bugs.updateBugStatusAction({
        bugId,
        status: newStatus,
      })

      if (error) {
        toast.error(error.message)
        // Revert status
        setStatus(currentStatus)
        return
      }

      toast.success('Estado actualizado')
      navigate(Urls.BUG_REPORT_DETAILS(bugId), { history: 'replace' })
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
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecciona un estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={BugStatus.OPEN}>Abierto</SelectItem>
          <SelectItem value={BugStatus.IN_REVIEW}>En Revisión</SelectItem>
          <SelectItem value={BugStatus.FIXED}>Corregido</SelectItem>
          <SelectItem value={BugStatus.CANCELED}>Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
