import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidUserProfileError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}
