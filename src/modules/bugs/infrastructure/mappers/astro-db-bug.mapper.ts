import { Bug, BugStatus, BugVisibility } from '../../domain/bug'
import type { AstroDbBugDto } from '../dtos/astro-db-bug.dto'

export class AstroDbBugMapper {
  static toDomain(raw: AstroDbBugDto, { userName }: { userName?: string }): Bug {
    return new Bug({
      id: raw.id,
      userId: raw.userId,
      userName: userName,
      title: raw.title,
      description: raw.description,
      status: raw.status as BugStatus,
      visibility: raw.visibility as BugVisibility,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }

  static toPersistence(bug: Bug) {
    return {
      id: bug.id,
      userId: bug.userId,
      title: bug.title,
      description: bug.description,
      status: bug.status,
      visibility: bug.visibility,
      createdAt: bug.createdAt,
      updatedAt: bug.updatedAt,
    }
  }
}
