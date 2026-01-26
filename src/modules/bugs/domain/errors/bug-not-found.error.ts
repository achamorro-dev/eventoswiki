import { DomainError } from '@/shared/domain/errors/domain-error'

export class BugNotFound extends DomainError {
  constructor(id: string) {
    super(`Bug with id ${id} not found`)
  }
}
