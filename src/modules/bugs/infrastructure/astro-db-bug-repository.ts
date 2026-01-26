import { BugComment as BugCommentTable, Bug as BugTable, db, desc, eq, User } from 'astro:db'
import type { Bug } from '@/modules/bugs/domain/bug'
import type { BugRepository } from '@/modules/bugs/domain/bug.repository'
import type { BugComment } from '@/modules/bugs/domain/bug-comment'
import { BugNotFound } from '@/modules/bugs/domain/errors/bug-not-found.error'
import { AstroDbBugMapper } from './mappers/astro-db-bug.mapper'
import { AstroDbBugCommentMapper } from './mappers/astro-db-bug-comment.mapper'

export class AstroDbBugRepository implements BugRepository {
  async create(bug: Bug): Promise<void> {
    await db.insert(BugTable).values(AstroDbBugMapper.toPersistence(bug))
  }

  async findById(id: string): Promise<Bug | null> {
    const result = await db
      .select()
      .from(BugTable)
      .leftJoin(User, eq(BugTable.userId, User.id))
      .where(eq(BugTable.id, id))
      .limit(1)
    if (result.length === 0) return null
    return AstroDbBugMapper.toDomain(result[0].Bug, { userName: result[0].User?.name })
  }

  async findAll(criteria?: { userId?: string; isAdmin?: boolean }): Promise<Bug[]> {
    // If Admin, show everything.
    // If User, show Public OR (Private AND isOwner).
    // If Guest (criteria not provided or userId null), show Public.

    const bugsWithUsers = await db
      .select()
      .from(BugTable)
      .leftJoin(User, eq(BugTable.userId, User.id))
      .orderBy(desc(BugTable.createdAt))

    const bugs = bugsWithUsers.map(({ Bug: bug, User: user }) =>
      AstroDbBugMapper.toDomain(bug, { userName: user?.name }),
    )

    if (criteria?.isAdmin) {
      return bugs
    }

    return bugs.filter(bug => {
      if (bug.isPublic()) return true
      if (criteria?.userId && bug.userId === criteria.userId) return true
      return false
    })
  }

  async update(bug: Bug): Promise<void> {
    await db.update(BugTable).set(AstroDbBugMapper.toPersistence(bug)).where(eq(BugTable.id, bug.id))
  }

  async addComment(comment: BugComment): Promise<void> {
    await db.insert(BugCommentTable).values(AstroDbBugCommentMapper.toPersistence(comment))
  }

  async findCommentsByBugId(bugId: string): Promise<BugComment[]> {
    const commentsWithUsers = await db
      .select()
      .from(BugCommentTable)
      .leftJoin(User, eq(BugCommentTable.userId, User.id))
      .where(eq(BugCommentTable.bugId, bugId))
      .orderBy(BugCommentTable.createdAt)

    return commentsWithUsers.map(({ BugComment: comment, User: user }) =>
      AstroDbBugCommentMapper.toDomain({ ...comment, userName: user?.username }),
    )
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(BugCommentTable).where(eq(BugCommentTable.bugId, id))
      await db.delete(BugTable).where(eq(BugTable.id, id))
    } catch (_error) {
      throw new BugNotFound(id)
    }
  }
}
