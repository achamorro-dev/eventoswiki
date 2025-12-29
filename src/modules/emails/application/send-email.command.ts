import { MeetupId } from '@/meetups/domain/meetup-id'
import type { MeetupsRepository } from '@/meetups/domain/meetups.repository'
import { OrganizationId } from '@/organizations/domain/organization-id'
import type { OrganizationsRepository } from '@/organizations/domain/organizations.repository'
import { Command } from '@/shared/application/use-case/command'
import { UserId } from '@/users/domain/user-id'
import type { UsersRepository } from '@/users/domain/users.repository'
import type { EmailsRepository } from '../domain/emails.repository'
import { EmailTemplateType } from '../domain/enums/email-template-type'
import { generateAttendMeetupEmailHtml } from '../infrastructure/templates/generate-attend-meetup-email'
import { generateIcs } from '../infrastructure/templates/generate-ics'

interface Param {
  templateType: EmailTemplateType
  recipientEmail: string
  meetupId: string
  userId: string
}

export class SendEmailCommand extends Command<Param, void> {
  constructor(
    private readonly emailsRepository: EmailsRepository,
    private readonly meetupsRepository: MeetupsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    try {
      const { templateType, recipientEmail, meetupId, userId } = param

      // Validar email
      if (!recipientEmail || !recipientEmail.includes('@')) {
        console.error(`[SendEmailCommand] Invalid email: ${recipientEmail}`)
        return
      }

      // Renderizar según tipo de template
      switch (templateType) {
        case EmailTemplateType.ATTEND_MEETUP:
          await this.sendAttendMeetupEmail(recipientEmail, meetupId, userId)
          break
        default:
          console.error(`[SendEmailCommand] Unknown template type: ${templateType}`)
      }
    } catch (error: unknown) {
      console.error('[SendEmailCommand] Unexpected error:', error)
      // No relanzar para no interrumpir el flujo principal
    }
  }

  private async sendAttendMeetupEmail(recipientEmail: string, meetupId: string, userId: string): Promise<void> {
    try {
      // Obtener datos del meetup
      const meetup = await this.meetupsRepository.find(MeetupId.of(meetupId))
      if (!meetup) {
        console.error(`[SendEmailCommand] Meetup not found: ${meetupId}`)
        return
      }

      // Obtener datos del usuario
      const user = await this.usersRepository.find(UserId.of(userId))
      if (!user) {
        console.error(`[SendEmailCommand] User not found: ${userId}`)
        return
      }

      // Obtener datos de la organización si existe
      let organization: Awaited<ReturnType<typeof this.organizationsRepository.find>> | undefined
      if (meetup.organizationId) {
        try {
          organization = await this.organizationsRepository.find(new OrganizationId(meetup.organizationId))
        } catch {
          // Si no se encuentra la organización, continuamos sin ella
          console.warn(`[SendEmailCommand] Organization not found: ${meetup.organizationId}`)
        }
      }

      // Generar contenido .ics
      const icsContent = generateIcs(meetup)

      // Generar HTML del email
      const emailHtml = generateAttendMeetupEmailHtml({
        userName: user.name,
        meetup,
        organization,
      })

      // Enviar email
      await this.emailsRepository.send({
        recipient: recipientEmail,
        subject: `¡Te has registrado en el meetup: ${meetup.title}`,
        html: emailHtml,
        attachments: [
          {
            filename: 'evento.ics',
            content: icsContent,
            contentType: 'text/calendar',
          },
        ],
      })
    } catch (error: unknown) {
      console.error('[SendEmailCommand] Error sending attend meetup email:', error)
      // No relanzar para no interrumpir el flujo principal
    }
  }
}
