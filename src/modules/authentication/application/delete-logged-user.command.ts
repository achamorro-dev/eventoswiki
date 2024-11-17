import { Command } from '@/shared/application/use-case/command'
import type { AuthenticationRepository } from '../domain/authentication.repository'
import { LoggedUserId } from '../domain/logged-user-id'
import type { InvalidateSessionCommand } from './invalidate-session.command'

interface Params {
  sessionId: string
  userId: string
}
export class DeleteLoggedUserCommand extends Command<Params> {
  constructor(
    private readonly invalidateSessionCommand: InvalidateSessionCommand,
    private readonly authenticationRepository: AuthenticationRepository,
  ) {
    super()
  }

  async execute(params: Params): Promise<void> {
    const { sessionId, userId } = params

    const loggedUserId = LoggedUserId.of(userId)
    await this.invalidateSessionCommand.execute({ sessionId })
    await this.authenticationRepository.deleteLoggedUser(loggedUserId)
  }
}
