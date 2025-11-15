import { DomainError } from '@/shared/domain/errors/domain-error'

export class EventAlreadyExists extends DomainError {
  constructor(slug: string) {
    super(`Event with slug ${slug} already exists`)
  }
}
