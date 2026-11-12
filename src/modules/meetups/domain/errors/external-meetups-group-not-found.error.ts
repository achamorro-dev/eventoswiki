import { DomainError } from '@/shared/domain/errors/domain-error'

export class ExternalMeetupsGroupNotFound extends DomainError {
  constructor(groupUrl: string) {
    super(`External meetups group not found for ${groupUrl}`)
  }
}
