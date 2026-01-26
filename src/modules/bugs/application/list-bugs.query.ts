import type { Bug } from '@/modules/bugs/domain/bug'
import type { BugRepository } from '@/modules/bugs/domain/bug.repository'
import { Query } from '@/shared/application/use-case/query'

interface ListBugsRequest {
  userId?: string
  isAdmin?: boolean
}

export class ListBugsQuery extends Query<Bug[], ListBugsRequest> {
  constructor(private readonly repository: BugRepository) {
    super()
  }

  async execute(input: ListBugsRequest): Promise<Bug[]> {
    return this.repository.findAll(input)
  }
}
