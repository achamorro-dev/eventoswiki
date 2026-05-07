import type { FindEventQuery } from '@/events/application/find-event.query'
import type { GetOrganizationByIdQuery } from '@/organizations/application/get-organization-by-id.query'
import { Command } from '@/shared/application/use-case/command'
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

      if (organization.followers.length === 0) {
        console.info(
          `[SendOrganizationEventCreatedEmailToFollowersCommand] No followers for organization: ${organizationId}`,
        )
        return
      }

      await this.sendOrganizationEventCreatedEmailCommand.execute({
        eventId: event.id.value,
        organizationId: organization.id.value,
      })
    } catch (error: unknown) {
      console.error('[SendOrganizationEventCreatedEmailToFollowersCommand] Unexpected error:', error)
    }
  }
}
