import type { GetUserOrganizationsQuery } from '@/organizations/application/get-user-organizations.query'
import { Command } from '@/shared/application/use-case/command'
import { MeetupNotFound } from '../domain/errors/meetup-not-found'
import { MeetupId } from '../domain/meetup-id'
import type { MeetupsRepository } from '../domain/meetups.repository'

interface Param {
  meetupId: string
  userId: string
}
export class DeleteMeetupCommand extends Command<Param, void> {
  constructor(
    private readonly meetupsRepository: MeetupsRepository,
    private readonly getUserOrganizationsQuery: GetUserOrganizationsQuery,
  ) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { meetupId, userId } = param

    const [meetup, organizations] = await Promise.all([
      this.meetupsRepository.find(MeetupId.of(meetupId)),
      this.getUserOrganizationsQuery.execute({ userId }),
    ])

    const userNotOrganizeTheMeetup = !organizations.some(organization => meetup.isOrganizedBy(organization.id))
    if (userNotOrganizeTheMeetup) {
      throw new MeetupNotFound(meetupId)
    }

    await this.meetupsRepository.delete(meetup.id)
  }
}
