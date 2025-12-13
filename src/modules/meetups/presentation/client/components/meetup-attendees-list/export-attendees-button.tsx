'use client'

import { actions } from 'astro:actions'
import { useState } from 'react'
import { toast } from 'sonner'
import type { MeetupAttendee } from '@/meetups/domain/meetup-attendee'
import { Button } from '@/ui/button'
import { Loader } from '@/ui/icons'

interface Props {
  meetupId: string
  attendees: MeetupAttendee[]
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

      // Create Excel file using the xlsx library (client-side generation)
      // We'll use a simple CSV format as fallback if xlsx is not available
      const csvContent = generateCSV(data.attendees)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${sanitizeFilename(data.meetupTitle)}-asistentes.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Listado exportado correctamente')
    } catch (error) {
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

function generateCSV(attendees: MeetupAttendee[]): string {
  const headers = ['Nombre', 'Usuario', 'Avatar']
  const rows = attendees.map(attendee => [
    `"${attendee.name}"`,
    `"${attendee.username}"`,
    `"${attendee.avatar || ''}"`,
  ])

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

