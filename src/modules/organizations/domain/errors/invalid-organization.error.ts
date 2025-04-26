import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidOrganizationError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}
