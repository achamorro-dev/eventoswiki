import type { DeletableByIdRepository } from '@/shared/domain/repository/deletable-by-id-repository'
import type { Bug } from './bug'
import type { BugComment } from './bug-comment'

export interface BugRepository extends DeletableByIdRepository<string> {
  create(bug: Bug): Promise<void>
  findById(id: string): Promise<Bug | null>
  findAll(criteria?: { userId?: string; isAdmin?: boolean }): Promise<Bug[]>
  update(bug: Bug): Promise<void>
  addComment(comment: BugComment): Promise<void>
  findCommentsByBugId(bugId: string): Promise<BugComment[]>
}
