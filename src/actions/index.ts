import { authenticationServerActions } from '@/authentication/presentation/server/actions'
import { userServerActions } from '@/users/presentation/server/actions'

export const server = {
  authentication: authenticationServerActions,
  user: userServerActions,
}
