import { BugComment } from '../../domain/bug-comment'
import type { AstroDbBugCommentDto } from '../dtos/astro-db-bug-comment.dto'

export class AstroDbBugCommentMapper {
  static toDomain(raw: AstroDbBugCommentDto, userName?: string): BugComment {
    return new BugComment({
      id: raw.id,
      bugId: raw.bugId,
      userId: raw.userId,
      userName: userName ?? raw.userName,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }

  static toPersistence(comment: BugComment) {
    return {
      id: comment.id,
      bugId: comment.bugId,
      userId: comment.userId,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
