import type { FindEventQuery } from '@/events/application/find-event.query'
import type { Event } from '@/events/domain/event'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { Organization } from '@/organizations/domain/organization'
import { Command } from '@/shared/application/use-case/command'
import type { GetUserSettingsQuery } from '@/user-settings/application/get-user-settings.query'
import type { GetUserQuery } from '@/users/application/get-user.query'
import type { EmailsRepository } from '../domain/emails.repository'
import { generateOrganizationEventCreatedEmailHtml } from '../infrastructure/templates/generate-organization-event-created-email'

interface Param {
  eventId: string
  organizationId: string
}

export class SendOrganizationEventCreatedEmailCommand extends Command<Param, void> {
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
        console.error(`[SendOrganizationEventCreatedEmailCommand] Event not found: ${eventId}`)
        return
      }

      const organization = await this.getOrganizationByIdQuery.execute({ id: organizationId })
      if (!organization) {
        console.error(`[SendOrganizationEventCreatedEmailCommand] Organization not found: ${organizationId}`)
        return
      }

      const followerIds = organization.followers
      if (followerIds.length === 0) {
        console.info(`[SendOrganizationEventCreatedEmailCommand] No followers for organization: ${organizationId}`)
        return
      }

      for (const followerId of followerIds) {
        await this.sendEmailToFollower(followerId, event, organization)
      }
    } catch (error: unknown) {
      console.error('[SendOrganizationEventCreatedEmailCommand] Unexpected error:', error)
    }
  }

  private async sendEmailToFollower(followerId: string, event: Event, organization: Organization) {
    try {
      const user = await this.getUserQuery.execute({ id: followerId })
      if (!user || !user.email) {
        console.warn(`[SendOrganizationEventCreatedEmailCommand] User or email not found: ${followerId}`)
        return
      }

      const userSettings = await this.getUserSettingsQuery.execute({ userId: followerId })
      const userHasDisabledOrganizationUpdatesEmails = !userSettings.organizationUpdatesEmailEnabled
      if (userHasDisabledOrganizationUpdatesEmails) {
        console.info(
          `[SendOrganizationEventCreatedEmailCommand] User has disabled organization updates emails: ${followerId}`,
        )
        return
      }

      const emailHtml = await generateOrganizationEventCreatedEmailHtml({
        userName: user.name,
        event,
        organization,
      })

      await this.emailsRepository.send({
        recipient: user.email,
        subject: `${organization.name} ha creado un nuevo evento: ${event.title}`,
        html: emailHtml,
      })
    } catch (error: unknown) {
      console.error(`[SendOrganizationEventCreatedEmailCommand] Error sending email to follower ${followerId}:`, error)
    }
  }
}
