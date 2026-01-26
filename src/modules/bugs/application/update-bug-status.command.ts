import { BugStatus } from '@/modules/bugs/domain/bug'
import type { BugRepository } from '@/modules/bugs/domain/bug.repository'
import { BugNotFound } from '@/modules/bugs/domain/errors/bug-not-found.error'
import { Command } from '@/shared/application/use-case/command'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'

interface UpdateBugStatusRequest {
  bugId: string
  status: BugStatus
  userId: string
  isAdmin: boolean
}

export class UpdateBugStatusCommand extends Command<UpdateBugStatusRequest> {
  constructor(private readonly repository: BugRepository) {
    super()
  }

  async execute(input: UpdateBugStatusRequest): Promise<void> {
    const { bugId, status, userId, isAdmin } = input

    const bug = await this.repository.findById(bugId)
    if (!bug) {
      throw new BugNotFound(bugId)
    }

    if (status === BugStatus.CANCELED) {
      if (!isAdmin && bug.userId !== userId) {
        throw new BadRequest('Solo el creador del bug o un admin puede cancelarlo')
      }
    } else if (!isAdmin) {
      throw new BadRequest('Solo los administradores pueden cambiar este estado')
    }

    bug.status = status
    bug.updatedAt = new Date()

    await this.repository.update(bug)
  }
}
