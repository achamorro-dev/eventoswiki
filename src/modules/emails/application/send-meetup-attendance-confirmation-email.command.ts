import type { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { GetUserQuery } from '@/users/application/get-user.query'
import { Command } from '@/shared/application/use-case/command'
import type { EmailsRepository } from '../domain/emails.repository'
import { generateAttendMeetupEmailHtml } from '../infrastructure/templates/generate-attend-meetup-email'
import { generateIcs } from '../infrastructure/templates/generate-ics'

interface Param {
  recipientEmail: string
  meetupId: string
  userId: string
}

export class SendMeetupAttendanceConfirmationEmailCommand extends Command<Param, void> {
  constructor(
    private readonly emailsRepository: EmailsRepository,
    private readonly findMeetupQuery: FindMeetupQuery,
    private readonly getUserQuery: GetUserQuery,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    try {
      const { recipientEmail, meetupId, userId } = param

      // Validar email
      if (!recipientEmail || !recipientEmail.includes('@')) {
        console.error(`[SendMeetupAttendanceConfirmationEmailCommand] Invalid email: ${recipientEmail}`)
        return
      }

      // Obtener datos del meetup
      const meetup = await this.findMeetupQuery.execute({ id: meetupId })
      if (!meetup) {
        console.error(`[SendMeetupAttendanceConfirmationEmailCommand] Meetup not found: ${meetupId}`)
        return
      }

      // Obtener datos del usuario
      const user = await this.getUserQuery.execute({ id: userId })
      if (!user) {
        console.error(`[SendMeetupAttendanceConfirmationEmailCommand] User not found: ${userId}`)
        return
      }

      // Obtener datos de la organización si existe
      let organization: Awaited<ReturnType<typeof this.getOrganizationByIdQuery.execute>> | undefined
      if (meetup.organizationId) {
        try {
          organization = await this.getOrganizationByIdQuery.execute({ id: meetup.organizationId })
        } catch {
          // Si no se encuentra la organización, continuamos sin ella
          console.warn(
            `[SendMeetupAttendanceConfirmationEmailCommand] Organization not found: ${meetup.organizationId}`,
          )
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
      console.error('[SendMeetupAttendanceConfirmationEmailCommand] Unexpected error:', error)
      // No relanzar para no interrumpir el flujo principal
    }
  }
}
