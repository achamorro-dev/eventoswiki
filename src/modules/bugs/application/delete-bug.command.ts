import { BugNotFound } from '@/modules/bugs/domain/errors/bug-not-found.error'
import { Command } from '@/shared/application/use-case/command'
import { BadRequest } from '@/shared/presentation/server/actions/errors/bad-request'
import type { BugRepository } from '../domain/bug.repository'

interface Param {
  bugId: string
  userId: string
}

export class DeleteBugCommand extends Command<Param, void> {
  constructor(private readonly bugsRepository: BugRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { bugId, userId } = param

    const bug = await this.bugsRepository.findById(bugId)

    if (!bug) {
      throw new BugNotFound(bugId)
    }

    if (bug.userId !== userId) {
      throw new BadRequest('Solo el creador del bug puede eliminarlo')
    }

    await this.bugsRepository.delete(bugId)
  }
}
