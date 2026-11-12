import { DomainError } from '@/shared/domain/errors/domain-error'

export class ExternalMeetupsRateLimited extends DomainError {
  constructor(groupUrl: string) {
    super(`External meetups source rate limited the requests for ${groupUrl}`)
  }
}
