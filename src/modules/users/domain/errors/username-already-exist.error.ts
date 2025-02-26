import { DomainError } from '@/shared/domain/errors/domain-error'

export class UsernameAlreadyExistError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}
