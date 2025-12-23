import type { UserIsOrganizerEnsurer } from '@/organizations/application/user-is-organizer-ensurer.service'
import { Command } from '@/shared/application/use-case/command'
import { MeetupNotFound } from '../domain/errors/meetup-not-found'
import type { MeetupAttendee } from '../domain/meetup-attendee'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  userId: string
}

interface Result {
  fileContent: string
  filename: string
  contentType: string
}

export class ExportAttendeesCommand extends Command<Param, Result> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly userIsOrganizerEnsurer: UserIsOrganizerEnsurer,
  ) {
    super()
  }

  async execute(param: Param): Promise<Result> {
    const { meetupId, userId } = param

    // Get meetup to verify it exists and get organization info
    const meetupIdObj = MeetupId.of(meetupId)
    const meetup = await this.meetupsRepository.find(meetupIdObj)
    if (!meetup) {
      throw new MeetupNotFound(meetupId)
    }

    if (!meetup.organizationId) {
      throw new Error('Este meetup no tiene organización')
    }

    // Check if user is organizer
    await this.userIsOrganizerEnsurer.ensure({
      userId,
      organizationId: meetup.organizationId,
    })

    // Get attendees with user data
    const attendees = await this.meetupsRepository.findAllAttendees(meetupId)

    // Generate CSV content
    const csvContent = this.generateCSV(attendees)
    const filename = `${this.sanitizeFilename(meetup.toPrimitives().title)}-asistentes.csv`

    return {
      fileContent: csvContent,
      filename,
      contentType: 'text/csv;charset=utf-8;',
    }
  }

  private generateCSV(attendees: MeetupAttendee[]): string {
    const headers = ['Nombre', 'Usuario', 'Avatar']
    const rows = attendees.map(attendee => [
      `"${attendee.toPrimitives().name}"`,
      `"${attendee.toPrimitives().username}"`,
      `"${attendee.toPrimitives().avatar || ''}"`,
    ])

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }
}
