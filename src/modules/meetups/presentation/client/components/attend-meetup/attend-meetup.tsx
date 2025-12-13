import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { type FC, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/ui/components/button'
import { Loader } from '@/ui/icons'

interface Props {
  meetupId: string
  initialAttending: boolean
  allowsAttendees: boolean
  isRegistrationOpen: boolean
  canAcceptMoreAttendees: boolean
  maxAttendees?: number
  currentAttendeesCount: number
}

export const AttendMeetup: FC<Props> = ({
  meetupId,
  initialAttending,
  allowsAttendees,
  isRegistrationOpen,
  canAcceptMoreAttendees,
  maxAttendees,
  currentAttendeesCount,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAttending, setIsAttending] = useState(initialAttending)

  const canUserAttend = allowsAttendees && isRegistrationOpen && canAcceptMoreAttendees

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
      {!allowsAttendees && (
        <p className="mb-2 text-xs text-muted-foreground">Este meetup no permite registro de asistentes.</p>
      )}

      {allowsAttendees && !isRegistrationOpen && !isAttending && (
        <p className="mb-2 text-xs text-muted-foreground">El periodo de registro ha finalizado.</p>
      )}

      {allowsAttendees && isRegistrationOpen && !canAcceptMoreAttendees && !isAttending && (
        <p className="mb-2 text-xs text-muted-foreground">El aforo del meetup está completo.</p>
      )}

      {maxAttendees && (
        <p className="mb-2 text-xs text-muted-foreground">
          Asistentes: {currentAttendeesCount} / {maxAttendees}
        </p>
      )}

      {isAttending && (
        <p className="mb-2 text-xs">Ya has confirmado tu asistencia a este meetup. ¿Quieres cancelarla?</p>
      )}

      {canUserAttend && !isAttending && (
        <p className="mb-2 text-xs">
          ¿Quieres asistir a este meetup? Haz clic en el botón para confirmar tu asistencia.
        </p>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={toggleAttendance}
        disabled={isLoading || (!canUserAttend && !isAttending)}
      >
        {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : isAttending ? 'Cancelar asistencia' : 'Asistir'}
      </Button>
    </>
  )
}
