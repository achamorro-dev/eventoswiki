import type { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import type { Meetup } from '@/meetups/domain/meetup'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { Organization } from '@/organizations/domain/organization'
import { Command } from '@/shared/application/use-case/command'
import type { GetUserSettingsQuery } from '@/user-settings/application/get-user-settings.query'
import type { GetUserQuery } from '@/users/application/get-user.query'
import type { EmailsRepository } from '../domain/emails.repository'
import { generateOrganizationMeetupCreatedEmailHtml } from '../infrastructure/templates/generate-organization-meetup-created-email'

interface Param {
  meetupId: string
  organizationId: string
}

export class SendOrganizationMeetupCreatedEmailCommand extends Command<Param, void> {
  constructor(
    private readonly emailsRepository: EmailsRepository,
    private readonly findMeetupQuery: FindMeetupQuery,
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
        console.error(`[SendOrganizationMeetupCreatedEmailCommand] Meetup not found: ${meetupId}`)
        return
      }

      const organization = await this.getOrganizationByIdQuery.execute({ id: organizationId })
      if (!organization) {
        console.error(`[SendOrganizationMeetupCreatedEmailCommand] Organization not found: ${organizationId}`)
        return
      }

      const followerIds = organization.followers
      if (followerIds.length === 0) {
        console.info(`[SendOrganizationMeetupCreatedEmailCommand] No followers for organization: ${organizationId}`)
        return
      }

      for (const followerId of followerIds) {
        await this.sendEmailToFollower(followerId, meetup, organization)
      }
    } catch (error: unknown) {
      console.error('[SendOrganizationMeetupCreatedEmailCommand] Unexpected error:', error)
    }
  }

  private async sendEmailToFollower(followerId: string, meetup: Meetup, organization: Organization) {
    try {
      const user = await this.getUserQuery.execute({ id: followerId })
      if (!user || !user.email) {
        console.warn(`[SendOrganizationMeetupCreatedEmailCommand] User or email not found: ${followerId}`)
        return
      }

      const userSettings = await this.getUserSettingsQuery.execute({ userId: followerId })
      const userHasDisabledOrganizationUpdatesEmails = !!userSettings && !userSettings.organizationUpdatesEmailEnabled
      if (userHasDisabledOrganizationUpdatesEmails) {
        console.info(
          `[SendOrganizationMeetupCreatedEmailCommand] User has disabled organization updates emails: ${followerId}`,
        )
        return
      }

      const emailHtml = await generateOrganizationMeetupCreatedEmailHtml({
        userName: user.name,
        meetup,
        organization,
      })

      await this.emailsRepository.send({
        recipient: user.email,
        subject: `${organization.name} ha creado un nuevo meetup: ${meetup.title}`,
        html: emailHtml,
      })
    } catch (error: unknown) {
      console.error(`[SendOrganizationMeetupCreatedEmailCommand] Error sending email to follower ${followerId}:`, error)
    }
  }
}
