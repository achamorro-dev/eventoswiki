import type { Meetup } from '@/meetups/domain/meetup'

/**
 * Genera un archivo iCalendar (.ics) a partir de los datos de un meetup.
 * Sigue el estándar RFC 5545 para máxima compatibilidad.
 */
export function generateIcs(meetup: Meetup): string {
  // Formatear fechas en formato iCalendar (YYYYMMDDTHHMMSSZ)
  const formatDateTime = (date: Date): string => {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
  }

  // Escapar caracteres especiales según RFC 5545
  const escapeIcsString = (str: string): string => {
    return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
  }

  const uid = `meetup-${meetup.id.value}@eventos.wiki`
  const dtstart = formatDateTime(meetup.startsAt)
  const dtend = formatDateTime(meetup.endsAt)
  const dtstamp = formatDateTime(new Date())
  const summary = escapeIcsString(meetup.title)
  const description = escapeIcsString(
    `${meetup.shortDescription}\n\nDetalles: https://eventos.wiki/meetups/${meetup.slug}`,
  )
  const location = meetup.location ? escapeIcsString(meetup.location) : ''
  const url = `https://eventos.wiki/meetups/${meetup.slug}`

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventosWiki//EventosWiki//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Calendario de EventosWiki',
    'X-WR-TIMEZONE:Europe/Madrid',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    ...(location ? [`LOCATION:${location}`] : []),
    `URL:${url}`,
    'TRANSP:OPAQUE',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return icsContent
}
