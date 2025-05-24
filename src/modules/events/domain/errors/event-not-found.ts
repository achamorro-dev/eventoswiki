import { DomainError } from '@/shared/domain/errors/domain-error'

export class EventNotFound extends DomainError {
  constructor(slug: string) {
    super('Event with slug ' + slug + ' not found')
  }
}
