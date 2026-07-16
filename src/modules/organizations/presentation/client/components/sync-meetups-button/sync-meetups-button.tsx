import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/ui/button'
import { ArrowsClockwise, Loader } from '@/ui/icons'
import { Urls } from '@/ui/urls/urls'

interface Props {
  organizationId: string
  organizationHandle: string
}

export const SyncMeetupsButton = ({ organizationId, organizationHandle }: Props) => {
  const [isSyncing, setIsSyncing] = useState(false)

  const syncMeetups = async () => {
    setIsSyncing(true)
    const { data, error } = await actions.meetups.syncMeetupsFromMeetupAction({ organizationId })
    setIsSyncing(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(`Sincronización completada: ${data.created} meetups nuevos y ${data.updated} actualizados`)
    navigate(Urls.ORGANIZATION_MEETUPS(organizationHandle))
  }

  return (
    <Button variant="outline" onClick={syncMeetups} disabled={isSyncing}>
      {isSyncing && (
        <>
          <Loader className="animate-spin" /> Sincronizando
        </>
      )}
      {!isSyncing && (
        <>
          <ArrowsClockwise /> Sincronizar con Meetup.com
        </>
      )}
    </Button>
  )
}
