import type { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import type { Meetup } from '@/meetups/domain/meetup'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { Organization } from '@/organizations/domain/organization'
import { Command } from '@/shared/application/use-case/command'
import type { GetUserQuery } from '@/users/application/get-user.query'
import { SendOrganizationMeetupCreatedEmailCommand } from './send-organization-meetup-created-email.command'

interface Param {
  meetupId: string
  organizationId: string
}

export class SendOrganizationMeetupCreatedEmailToFollowersCommand extends Command<Param, void> {
  constructor(
    private readonly sendOrganizationMeetupCreatedEmailCommand: SendOrganizationMeetupCreatedEmailCommand,
    private readonly findMeetupQuery: FindMeetupQuery,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
    private readonly getUserQuery: GetUserQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    try {
      const { meetupId, organizationId } = param

      const meetup = await this.findMeetupQuery.execute({ id: meetupId })
      if (!meetup) {
        console.error(`[SendOrganizationMeetupCreatedEmailToFollowersCommand] Meetup not found: ${meetupId}`)
        return
      }

      const organization = await this.getOrganizationByIdQuery.execute({ id: organizationId })
      if (!organization) {
        console.error(
          `[SendOrganizationMeetupCreatedEmailToFollowersCommand] Organization not found: ${organizationId}`,
        )
        return
      }

      const followerIds = organization.followers
      if (followerIds.length === 0) {
        console.info(
          `[SendOrganizationMeetupCreatedEmailToFollowersCommand] No followers for organization: ${organizationId}`,
        )
        return
      }

      const emailPromises = followerIds.map(followerId => this.sendEmailToFollower(followerId, meetup, organization))

      emailPromises.forEach(promise => {
        promise.catch(error => {
          console.error(`[SendOrganizationMeetupCreatedEmailToFollowersCommand] Error in email promise:`, error)
        })
      })
    } catch (error: unknown) {
      console.error('[SendOrganizationMeetupCreatedEmailToFollowersCommand] Unexpected error:', error)
    }
  }

  private async sendEmailToFollower(followerId: string, meetup: Meetup, organization: Organization) {
    try {
      const user = await this.getUserQuery.execute({ id: followerId })
      if (!user || !user.email) {
        console.warn(`[SendOrganizationMeetupCreatedEmailToFollowersCommand] User or email not found: ${followerId}`)
        return
      }

      await this.sendOrganizationMeetupCreatedEmailCommand.execute({
        meetupId: meetup.id.value,
        organizationId: organization.id.value,
      })
    } catch (error: unknown) {
      console.error(
        `[SendOrganizationMeetupCreatedEmailToFollowersCommand] Error sending email to follower ${followerId}:`,
        error,
      )
    }
  }
}
