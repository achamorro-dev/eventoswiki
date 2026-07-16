import { DomainError } from '@/shared/domain/errors/domain-error'

export class MeetupGroupNotFound extends DomainError {
  constructor(groupUrl: string) {
    super(`Meetup group not found for ${groupUrl}`)
  }
}
