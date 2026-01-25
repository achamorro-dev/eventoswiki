import { FeatureRequest } from '../../domain/feature-request'
import type { AstroDbFeatureRequestDto } from '../dtos/astro-db-feature-request.dto'

export class AstroDbFeatureRequestMapper {
  static toDomain(dto: AstroDbFeatureRequestDto, votesCount: number, hasVoted: boolean): FeatureRequest {
    return FeatureRequest.fromPrimitives({
      id: dto.id,
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      createdAt: dto.createdAt.toISOString(),
      updatedAt: dto.updatedAt.toISOString(),
      votesCount,
      hasVoted,
    })
  }
}
