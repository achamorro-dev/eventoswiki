import type { BugRepository } from '@/modules/bugs/domain/bug.repository'
import type { BugComment } from '@/modules/bugs/domain/bug-comment'
import { Query } from '@/shared/application/use-case/query'

interface GetBugCommentsRequest {
  bugId: string
}

export class GetBugCommentsQuery extends Query<BugComment[], GetBugCommentsRequest> {
  constructor(private readonly repository: BugRepository) {
    super()
  }

  async execute(input: GetBugCommentsRequest): Promise<BugComment[]> {
    return this.repository.findCommentsByBugId(input.bugId)
  }
}
