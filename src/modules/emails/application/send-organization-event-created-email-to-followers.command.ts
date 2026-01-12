import type { FindEventQuery } from '@/events/application/find-event.query'
import type { Event } from '@/events/domain/event'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import type { Organization } from '@/organizations/domain/organization'
import { Command } from '@/shared/application/use-case/command'
import type { GetUserQuery } from '@/users/application/get-user.query'
import { SendOrganizationEventCreatedEmailCommand } from './send-organization-event-created-email.command'

interface Param {
  eventId: string
  organizationId: string
}

export class SendOrganizationEventCreatedEmailToFollowersCommand extends Command<Param, void> {
  constructor(
    private readonly sendOrganizationEventCreatedEmailCommand: SendOrganizationEventCreatedEmailCommand,
    private readonly findEventQuery: FindEventQuery,
    private readonly getOrganizationByIdQuery: GetOrganizationByIdQuery,
    private readonly getUserQuery: GetUserQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    try {
      const { eventId, organizationId } = param

      const event = await this.findEventQuery.execute({ id: eventId })
      if (!event) {
        console.error(`[SendOrganizationEventCreatedEmailToFollowersCommand] Event not found: ${eventId}`)
        return
      }

      const organization = await this.getOrganizationByIdQuery.execute({ id: organizationId })
      if (!organization) {
        console.error(`[SendOrganizationEventCreatedEmailToFollowersCommand] Organization not found: ${organizationId}`)
        return
      }

      const followerIds = organization.followers
      if (followerIds.length === 0) {
        console.info(
          `[SendOrganizationEventCreatedEmailToFollowersCommand] No followers for organization: ${organizationId}`,
        )
        return
      }

      const emailPromises = followerIds.map(followerId => this.sendEmailToFollower(followerId, event, organization))

      emailPromises.forEach(promise => {
        promise.catch(error => {
          console.error(`[SendOrganizationEventCreatedEmailToFollowersCommand] Error in email promise:`, error)
        })
      })
    } catch (error: unknown) {
      console.error('[SendOrganizationEventCreatedEmailToFollowersCommand] Unexpected error:', error)
    }
  }

  private async sendEmailToFollower(followerId: string, event: Event, organization: Organization) {
    try {
      const user = await this.getUserQuery.execute({ id: followerId })
      if (!user || !user.email) {
        console.warn(`[SendOrganizationEventCreatedEmailToFollowersCommand] User or email not found: ${followerId}`)
        return
      }

      await this.sendOrganizationEventCreatedEmailCommand.execute({
        eventId: event.id.value,
        organizationId: organization.id.value,
      })
    } catch (error: unknown) {
      console.error(
        `[SendOrganizationEventCreatedEmailToFollowersCommand] Error sending email to follower ${followerId}:`,
        error,
      )
    }
  }
}
