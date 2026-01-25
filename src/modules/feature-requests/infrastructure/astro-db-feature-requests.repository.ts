import { and, count, db, eq, FeatureRequest, FeatureRequestVote } from 'astro:db'
import { FeatureRequest as FeatureRequestEntity } from '../domain/feature-request'
import { FeatureRequestId } from '../domain/feature-request-id'
import type { FeatureRequestsRepository } from '../domain/feature-requests.repository'
import type { AstroDbFeatureRequestDto } from './dtos/astro-db-feature-request.dto'
import { AstroDbFeatureRequestMapper } from './mappers/astro-db-feature-request.mapper'

export class AstroDbFeatureRequestsRepository implements FeatureRequestsRepository {
  async save(featureRequest: FeatureRequestEntity): Promise<void> {
    const existing = await db
      .select()
      .from(FeatureRequest)
      .where(eq(FeatureRequest.id, featureRequest.id.value))
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(FeatureRequest)
        .set({
          title: featureRequest.title,
          description: featureRequest.description,
          updatedAt: featureRequest.updatedAt,
        })
        .where(eq(FeatureRequest.id, featureRequest.id.value))
    } else {
      await db.insert(FeatureRequest).values({
        id: featureRequest.id.value,
        userId: featureRequest.userId,
        title: featureRequest.title,
        description: featureRequest.description,
        createdAt: featureRequest.createdAt,
        updatedAt: featureRequest.updatedAt,
      })
    }
  }

  async findAll(currentUserId?: string): Promise<FeatureRequestEntity[]> {
    const requests = await db.select().from(FeatureRequest)

    // Get vote counts
    const votes = await db
      .select({
        featureRequestId: FeatureRequestVote.featureRequestId,
        count: count(FeatureRequestVote.userId),
      })
      .from(FeatureRequestVote)
      .groupBy(FeatureRequestVote.featureRequestId)

    const votesMap = new Map<string, number>()
    votes.forEach(v => {
      votesMap.set(v.featureRequestId, v.count)
    })

    // Get user votes if logged in
    const userVotesSet = new Set<string>()
    if (currentUserId) {
      const userVotes = await db.select().from(FeatureRequestVote).where(eq(FeatureRequestVote.userId, currentUserId))

      userVotes.forEach(v => {
        userVotesSet.add(v.featureRequestId)
      })
    }

    return requests
      .map(request => {
        const votesCount = votesMap.get(request.id) ?? 0
        const hasVoted = userVotesSet.has(request.id)
        return AstroDbFeatureRequestMapper.toDomain(request as AstroDbFeatureRequestDto, votesCount, hasVoted)
      })
      .sort((a, b) => b.votesCount - a.votesCount) // Sort by votes desc
  }

  async toggleVote(featureRequestId: FeatureRequestId, userId: string): Promise<void> {
    const existingVote = await db
      .select()
      .from(FeatureRequestVote)
      .where(
        and(eq(FeatureRequestVote.featureRequestId, featureRequestId.value), eq(FeatureRequestVote.userId, userId)),
      )
      .limit(1)

    if (existingVote.length > 0) {
      await db
        .delete(FeatureRequestVote)
        .where(
          and(eq(FeatureRequestVote.featureRequestId, featureRequestId.value), eq(FeatureRequestVote.userId, userId)),
        )
    } else {
      await db.insert(FeatureRequestVote).values({
        featureRequestId: featureRequestId.value,
        userId: userId,
      })
    }
  }
}
