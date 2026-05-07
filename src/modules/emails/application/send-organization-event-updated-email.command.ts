import type { FindEventQuery } from '@/events/application/find-event.query'
import type { Event } from '@/events/domain/event'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { Organization } from '@/organizations/domain/organization'
import { Command } from '@/shared/application/use-case/command'
import type { GetUserSettingsQuery } from '@/user-settings/application/get-user-settings.query'
import type { GetUserQuery } from '@/users/application/get-user.query'
import type { EmailsRepository } from '../domain/emails.repository'
import { generateOrganizationEventUpdatedEmailHtml } from '../infrastructure/templates/generate-organization-event-updated-email'

interface Param {
  eventId: string
  organizationId: string
}

export class SendOrganizationEventUpdatedEmailCommand extends Command<Param, void> {
  constructor(
    private readonly emailsRepository: EmailsRepository,
    private readonly findEventQuery: FindEventQuery,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
    private readonly getUserQuery: GetUserQuery,
    private readonly getUserSettingsQuery: GetUserSettingsQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    try {
      const { eventId, organizationId } = param

      const event = await this.findEventQuery.execute({ id: eventId })
      if (!event) {
        console.error(`[SendOrganizationEventUpdatedEmailCommand] Event not found: ${eventId}`)
        return
      }

      const organization = await this.getOrganizationByIdQuery.execute({ id: organizationId })
      if (!organization) {
        console.error(`[SendOrganizationEventUpdatedEmailCommand] Organization not found: ${organizationId}`)
        return
      }

      const followerIds = organization.followers
      if (followerIds.length === 0) {
        console.info(`[SendOrganizationEventUpdatedEmailCommand] No followers for organization: ${organizationId}`)
        return
      }

      const sentEmails = new Set<string>()
      for (const followerId of followerIds) {
        await this.sendEmailToFollower(followerId, event, organization, sentEmails)
      }
    } catch (error: unknown) {
      console.error('[SendOrganizationEventUpdatedEmailCommand] Unexpected error:', error)
    }
  }

  private async sendEmailToFollower(
    followerId: string,
    event: Event,
    organization: Organization,
    sentEmails: Set<string>,
  ) {
    try {
      const user = await this.getUserQuery.execute({ id: followerId })
      if (!user || !user.email) {
        console.warn(`[SendOrganizationEventUpdatedEmailCommand] User or email not found: ${followerId}`)
        return
      }

      if (sentEmails.has(user.email)) {
        console.info(`[SendOrganizationEventUpdatedEmailCommand] Skipping duplicate email for address: ${user.email}`)
        return
      }

      const userSettings = await this.getUserSettingsQuery.execute({ userId: followerId })
      const userHasDisabledOrganizationUpdatesEmails = !userSettings.organizationUpdatesEmailEnabled
      if (userHasDisabledOrganizationUpdatesEmails) {
        console.info(
          `[SendOrganizationEventUpdatedEmailCommand] User has disabled organization updates emails: ${followerId}`,
        )
        return
      }

      const emailHtml = await generateOrganizationEventUpdatedEmailHtml({
        userName: user.name,
        event,
        organization,
      })

      await this.emailsRepository.send({
        recipient: user.email,
        subject: `Evento actualizado: ${event.title}`,
        html: emailHtml,
        senderName: organization.name,
      })

      sentEmails.add(user.email)
    } catch (error: unknown) {
      console.error(`[SendOrganizationEventUpdatedEmailCommand] Error sending email to follower ${followerId}:`, error)
    }
  }
}
