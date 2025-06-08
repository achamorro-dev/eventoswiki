import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidMeetupError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}
