import { Bug, BugVisibility } from '@/modules/bugs/domain/bug'
import type { BugRepository } from '@/modules/bugs/domain/bug.repository'
import { Command } from '@/shared/application/use-case/command'

interface CreateBugRequest {
  userId: string
  title: string
  description: string
  isPrivate: boolean
}

export class CreateBugCommand extends Command<CreateBugRequest> {
  constructor(private readonly repository: BugRepository) {
    super()
  }

  async execute(input: CreateBugRequest): Promise<void> {
    const bug = Bug.create({
      userId: input.userId,
      title: input.title,
      description: input.description,
      visibility: input.isPrivate ? BugVisibility.PRIVATE : BugVisibility.PUBLIC,
    })

    await this.repository.create(bug)
  }
}
