import type { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import type { FindMeetupAttendeesQuery } from '@/meetups/application/find-meetup-attendees.query'
import type { Meetup } from '@/meetups/domain/meetup'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { Organization } from '@/organizations/domain/organization'
import { Command } from '@/shared/application/use-case/command'
import type { GetUserSettingsQuery } from '@/user-settings/application/get-user-settings.query'
import type { GetUserQuery } from '@/users/application/get-user.query'
import type { EmailsRepository } from '../domain/emails.repository'
import { generateOrganizationMeetupUpdatedEmailHtml } from '../infrastructure/templates/generate-organization-meetup-updated-email'

interface Param {
  meetupId: string
  organizationId: string
}

export class SendOrganizationMeetupUpdatedEmailCommand extends Command<Param, void> {
  constructor(
    private readonly emailsRepository: EmailsRepository,
    private readonly findMeetupQuery: FindMeetupQuery,
    private readonly findMeetupAttendeesQuery: FindMeetupAttendeesQuery,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
    private readonly getUserQuery: GetUserQuery,
    private readonly getUserSettingsQuery: GetUserSettingsQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    try {
      const { meetupId, organizationId } = param

      const meetup = await this.findMeetupQuery.execute({ id: meetupId })
      if (!meetup) {
        console.error(`[SendOrganizationMeetupUpdatedEmailCommand] Meetup not found: ${meetupId}`)
        return
      }

      const organization = await this.getOrganizationByIdQuery.execute({ id: organizationId })
      if (!organization) {
        console.error(`[SendOrganizationMeetupUpdatedEmailCommand] Organization not found: ${organizationId}`)
        return
      }

      const followerIds = organization.followers
      const attendees = await this.findMeetupAttendeesQuery.execute(meetupId)
      const attendeeUserIds = attendees.map(a => a.userId)

      const recipientIds = [...new Set([...followerIds, ...attendeeUserIds])]
      if (recipientIds.length === 0) {
        console.info(`[SendOrganizationMeetupUpdatedEmailCommand] No recipients for meetup: ${meetupId}`)
        return
      }

      const sentEmails = new Set<string>()
      for (const recipientId of recipientIds) {
        await this.sendEmailToRecipient(recipientId, meetup, organization, sentEmails)
      }
    } catch (error: unknown) {
      console.error('[SendOrganizationMeetupUpdatedEmailCommand] Unexpected error:', error)
    }
  }

  private async sendEmailToRecipient(
    recipientId: string,
    meetup: Meetup,
    organization: Organization,
    sentEmails: Set<string>,
  ) {
    try {
      const user = await this.getUserQuery.execute({ id: recipientId })
      if (!user || !user.email) {
        console.warn(`[SendOrganizationMeetupUpdatedEmailCommand] User or email not found: ${recipientId}`)
        return
      }

      if (sentEmails.has(user.email)) {
        console.info(`[SendOrganizationMeetupUpdatedEmailCommand] Skipping duplicate email for address: ${user.email}`)
        return
      }

      const userSettings = await this.getUserSettingsQuery.execute({ userId: recipientId })
      const userHasDisabledOrganizationUpdatesEmails = !userSettings.organizationUpdatesEmailEnabled
      if (userHasDisabledOrganizationUpdatesEmails) {
        console.info(
          `[SendOrganizationMeetupUpdatedEmailCommand] User has disabled organization updates emails: ${recipientId}`,
        )
        return
      }

      const emailHtml = await generateOrganizationMeetupUpdatedEmailHtml({
        userName: user.name,
        meetup,
        organization,
      })

      await this.emailsRepository.send({
        recipient: user.email,
        subject: `Meetup actualizado: ${meetup.title}`,
        html: emailHtml,
        senderName: organization.name,
      })

      sentEmails.add(user.email)
    } catch (error: unknown) {
      console.error(
        `[SendOrganizationMeetupUpdatedEmailCommand] Error sending email to recipient ${recipientId}:`,
        error,
      )
    }
  }
}
