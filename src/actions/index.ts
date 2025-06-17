import { authenticationServerActions } from '@/authentication/presentation/server/actions'
import { eventsServerActions } from '@/events/presentation/server/actions'
import { filesServerActions } from '@/files/presentation/server/actions'
import { meetupsServerActions } from '@/meetups/presentation/server/actions'
import { organizationServerActions } from '@/organizations/presentation/server/actions'
import { userServerActions } from '@/users/presentation/server/actions'

export const server = {
  authentication: authenticationServerActions,
  user: userServerActions,
  organizations: organizationServerActions,
  files: filesServerActions,
  events: eventsServerActions,
  meetups: meetupsServerActions,
}
