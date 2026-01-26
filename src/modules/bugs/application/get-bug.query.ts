import type { Bug } from '@/modules/bugs/domain/bug'
import type { BugRepository } from '@/modules/bugs/domain/bug.repository'
import { Query } from '@/shared/application/use-case/query'

interface GetBugRequest {
  id: string
}

export class GetBugQuery extends Query<Bug | null, GetBugRequest> {
  constructor(private readonly repository: BugRepository) {
    super()
  }

  async execute(input: GetBugRequest): Promise<Bug | null> {
    return this.repository.findById(input.id)
  }
}
