import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidEventError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}
