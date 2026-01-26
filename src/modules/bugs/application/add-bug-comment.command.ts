import type { BugRepository } from '@/modules/bugs/domain/bug.repository'
import { BugComment } from '@/modules/bugs/domain/bug-comment'
import { Command } from '@/shared/application/use-case/command'

interface AddBugCommentRequest {
  bugId: string
  userId: string
  content: string
}

export class AddBugCommentCommand extends Command<AddBugCommentRequest> {
  constructor(private readonly repository: BugRepository) {
    super()
  }

  async execute(input: AddBugCommentRequest): Promise<void> {
    const comment = BugComment.create({
      bugId: input.bugId,
      userId: input.userId,
      content: input.content,
    })

    await this.repository.addComment(comment)
  }
}
