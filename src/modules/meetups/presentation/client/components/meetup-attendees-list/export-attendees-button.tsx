'use client'

import { actions } from 'astro:actions'
import { useState } from 'react'
import { toast } from 'sonner'
import type { MeetupAttendee } from '@/meetups/domain/meetup-attendee'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Button } from '@/ui/button'
import { Loader } from '@/ui/icons'

interface Props {
  meetupId: string
  attendees: Primitives<MeetupAttendee>[]
}

export const ExportAttendeesButton = ({ meetupId, attendees }: Props) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const { data, error } = await actions.meetups.exportAttendeesAction({ meetupId })

      if (error) {
        toast.error(error.message)
        return
      }

      if (!data) {
        toast.error('No se pudieron obtener los datos de los asistentes')
        return
      }

      // Create blob from server-generated file content
      const blob = new Blob([data.fileContent], { type: data.contentType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = data.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Listado exportado correctamente')
    } catch (_error) {
      toast.error('Error al exportar el listado')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting || attendees.length === 0}>
      {isExporting ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Exportando...
        </>
      ) : (
        'Exportar'
      )}
    </Button>
  )
}
