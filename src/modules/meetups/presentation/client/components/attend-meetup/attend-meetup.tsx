import { Button } from '@/ui/components/button'
import { useState, type FC } from 'react'

import { Loader } from '@/ui/icons'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { toast } from 'sonner'

interface Props {
  meetupId: string
  initialAttending: boolean
}

export const AttendMeetup: FC<Props> = ({ meetupId, initialAttending }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAttending, setIsAttending] = useState(initialAttending)

  const toggleAttendance = async () => {
    if (isAttending) {
      await unattendMeetup()
    } else {
      await attentMeetup()
    }
  }

  const attentMeetup = async () => {
    try {
      setIsLoading(true)
      const { error } = await actions.meetups.attendMeetupAction({ meetupId })
      if (error) {
        toast.error(error.message)
        return
      }
      setIsAttending(true)
      refreshMeetup()
    } catch (error) {
      toast.error('Error al asistir al meetup')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshMeetup = () => {
    const currentUrl = new URL(window.location.href)
    navigate(currentUrl.pathname + currentUrl.search, { history: 'replace' })
  }

  const unattendMeetup = async () => {
    try {
      setIsLoading(true)
      const { error } = await actions.meetups.unattendMeetupAction({ meetupId })
      if (error) {
        toast.error(error.message)
        return
      }
      setIsAttending(false)
      refreshMeetup()
    } catch (error) {
      toast.error('Error al cancelar la asistencia al meetup')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isAttending && (
        <p className="mb-2 text-xs">Ya has confirmado tu asistencia a este meetup. ¿Quieres cancelarla?</p>
      )}
      {!isAttending && (
        <p className="mb-2 text-xs">
          ¿Quieres asistir a este meetup? Haz clic en el botón para confirmar tu asistencia.
        </p>
      )}
      <Button variant="outline" size="sm" onClick={toggleAttendance} disabled={isLoading}>
        {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : isAttending ? 'Cancelar asistencia' : 'Asistir'}
      </Button>
    </>
  )
}
