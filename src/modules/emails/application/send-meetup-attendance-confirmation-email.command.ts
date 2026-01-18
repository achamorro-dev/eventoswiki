import type { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import { Command } from '@/shared/application/use-case/command'
import type { GetUserSettingsQuery } from '@/user-settings/application/get-user-settings.query'
import type { GetUserQuery } from '@/users/application/get-user.query'
import type { EmailsRepository } from '../domain/emails.repository'
import { generateAttendMeetupEmailHtml } from '../infrastructure/templates/generate-attend-meetup-email'
import { generateIcs } from '../infrastructure/templates/generate-ics'

interface Param {
  meetupId: string
  userId: string
}

export class SendMeetupAttendanceConfirmationEmailCommand extends Command<Param, void> {
  constructor(
    private readonly emailsRepository: EmailsRepository,
    private readonly findMeetupQuery: FindMeetupQuery,
    private readonly getUserQuery: GetUserQuery,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
    private readonly getUserSettingsQuery: GetUserSettingsQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    try {
      const { meetupId, userId } = param

      // Obtener datos del meetup
      const meetup = await this.findMeetupQuery.execute({ id: meetupId })
      if (!meetup) {
        console.error(`[SendMeetupAttendanceConfirmationEmailCommand] Meetup not found: ${meetupId}`)
        return
      }

      const user = await this.getUserQuery.execute({ id: userId })
      if (!user || !user.email) {
        console.error(`[SendMeetupAttendanceConfirmationEmailCommand] User or email not found: ${userId}`)
        return
      }

      const userSettings = await this.getUserSettingsQuery.execute({ userId })
      const userHasDisabledEmails = !userSettings.meetupAttendanceEmailEnabled
      if (userHasDisabledEmails) {
        console.info(
          `[SendMeetupAttendanceConfirmationEmailCommand] User has disabled meetup attendance emails: ${userId}`,
        )
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
      const emailHtml = await generateAttendMeetupEmailHtml({
        userName: user.name,
        meetup,
        organization,
      })

      // Enviar email
      await this.emailsRepository.send({
        recipient: user.email,
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
