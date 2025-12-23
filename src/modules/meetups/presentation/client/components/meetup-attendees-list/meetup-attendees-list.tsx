'use client'

import { actions } from 'astro:actions'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { MeetupAttendee } from '@/meetups/domain/meetup-attendee'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/button'
import { Loader, User, X } from '@/ui/icons'
import { ExportAttendeesButton } from './export-attendees-button'
import type { Primitives } from '@/shared/domain/primitives/primitives'

interface Props {
  meetupId: string
  initialAttendees?: Primitives<MeetupAttendee>[]
  onAttendeesChange?: (attendees: Primitives<MeetupAttendee>[]) => void
}

export const MeetupAttendeesList = ({ meetupId, initialAttendees = [], onAttendeesChange }: Props) => {
  const [attendees, setAttendees] = useState<Array<Primitives<MeetupAttendee>>>(initialAttendees)
  const [isLoading, setIsLoading] = useState(false)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  const handleRemoveAttendee = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${userName} de la lista de asistentes?`)) {
      return
    }

    setRemovingIds(prev => new Set(prev).add(userId))
    try {
      const { error } = await actions.meetups.removeAttendeeAction({
        meetupId,
        userId,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      // Optimistically update the UI
      setAttendees(prev => prev.filter(attendee => attendee.userId !== userId))
      onAttendeesChange?.(attendees.filter(attendee => attendee.userId !== userId))
      toast.success('Asistente eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar el asistente')
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  // Fetch attendees if they were not provided initially
  useEffect(() => {
    const fetchAttendees = async () => {
      if (initialAttendees.length > 0) return

      setIsLoading(true)

      try {
        const { data, error } = await actions.meetups.getAttendeesAction({ meetupId })

        if (error) {
          toast.error(error.message)
          return
        }

        if (data?.attendees) {
          setAttendees(data.attendees)
        }
      } catch (err) {
        toast.error('Error al obtener los asistentes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttendees()
  }, [initialAttendees.length, meetupId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (attendees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay asistentes registrados</h3>
        <p className="text-muted-foreground">
          Cuando los usuarios se registren para este meetup, aparecerán aquí.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {attendees.length} {attendees.length === 1 ? 'asistente registrado' : 'asistentes registrados'}
        </p>
        <ExportAttendeesButton meetupId={meetupId} attendees={attendees} />
      </div>

      <div className="border rounded-lg divide-y">
        {attendees.map(attendee => (
          <div key={attendee.userId} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {attendee.avatar ? (
                  <AvatarImage src={attendee.avatar} alt={attendee.name} />
                ) : (
                  <AvatarFallback>
                    <User className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{attendee.name}</p>
                <p className="text-sm text-muted-foreground">@{attendee.username}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveAttendee(attendee.userId, attendee.name)}
              disabled={removingIds.has(attendee.userId)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {removingIds.has(attendee.userId) ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              <span className="sr-only">Eliminar asistente</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

