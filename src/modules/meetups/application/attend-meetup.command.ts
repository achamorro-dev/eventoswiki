import { Command } from '@/shared/application/use-case/command'
import type { SendEmailCommand } from '@/emails/application/send-email.command'
import { EmailTemplateType } from '@/emails/domain/enums/email-template-type'
import { MeetupNotFound } from '../domain/errors/meetup-not-found'
import { MeetupAttendeeId } from '../domain/meetup-attendee-id'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  userId: string
  userEmail: string
}

export class AttendMeetupCommand extends Command<Param, void> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly sendEmailCommand: SendEmailCommand,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { meetupId, userId, userEmail } = param

    const meetup = await this.meetupsRepository.find(MeetupId.of(meetupId))
    if (!meetup) {
      throw new MeetupNotFound(meetupId)
    }

    meetup.addAttendee(MeetupAttendeeId.of(userId))
    await this.meetupsRepository.addAttendees(meetup)

    // Enviar email de notificación (sin fallar si hay error)
    try {
      await this.sendEmailCommand.execute({
        templateType: EmailTemplateType.ATTEND_MEETUP,
        recipientEmail: userEmail,
        meetupId,
        userId,
      })
    } catch (error: unknown) {
      console.error('[AttendMeetupCommand] Failed to send notification email:', error)
      // Continuamos sin interrumpir el flujo principal
    }
  }
}
