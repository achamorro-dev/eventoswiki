import { v4 as uuidv4 } from 'uuid'
import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { FeatureRequestId } from './feature-request-id'

export class FeatureRequest {
  id: FeatureRequestId
  userId: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  votesCount: number
  hasVoted: boolean

  private constructor(props: FeatureRequestProps) {
    this.id = props.id
    this.userId = props.userId
    this.title = props.title
    this.description = props.description
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.votesCount = props.votesCount ?? 0
    this.hasVoted = props.hasVoted ?? false
  }

  static create(data: { title: string; description: string; userId: string }): FeatureRequest {
    return new FeatureRequest({
      id: new FeatureRequestId(uuidv4()),
      userId: data.userId,
      title: data.title,
      description: data.description,
      createdAt: Datetime.now(),
      updatedAt: Datetime.now(),
      votesCount: 0,
      hasVoted: false,
    })
  }

  static fromPrimitives(
    primitives: Primitives<FeatureRequest> & { votesCount?: number; hasVoted?: boolean },
  ): FeatureRequest {
    return new FeatureRequest({
      id: new FeatureRequestId(primitives.id),
      userId: primitives.userId,
      title: primitives.title,
      description: primitives.description,
      createdAt: new Date(primitives.createdAt),
      updatedAt: new Date(primitives.updatedAt),
      votesCount: primitives.votesCount,
      hasVoted: primitives.hasVoted,
    })
  }

  toPrimitives(): Primitives<FeatureRequest> & { votesCount: number; hasVoted: boolean } {
    return {
      id: this.id.value,
      userId: this.userId,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      votesCount: this.votesCount,
      hasVoted: this.hasVoted,
    }
  }
}

export interface FeatureRequestProps {
  id: FeatureRequestId
  userId: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  votesCount?: number
  hasVoted?: boolean
}
