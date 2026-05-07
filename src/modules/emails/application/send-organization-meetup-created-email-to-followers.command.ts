import type { FindMeetupQuery } from '@/meetups/application/find-meetup.query'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import { Command } from '@/shared/application/use-case/command'
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

      if (organization.followers.length === 0) {
        console.info(
          `[SendOrganizationMeetupCreatedEmailToFollowersCommand] No followers for organization: ${organizationId}`,
        )
        return
      }

      await this.sendOrganizationMeetupCreatedEmailCommand.execute({
        meetupId: meetup.id.value,
        organizationId: organization.id.value,
      })
    } catch (error: unknown) {
      console.error('[SendOrganizationMeetupCreatedEmailToFollowersCommand] Unexpected error:', error)
    }
  }
}
