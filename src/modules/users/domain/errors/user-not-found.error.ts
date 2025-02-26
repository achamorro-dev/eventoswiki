import { DomainError } from '@/shared/domain/errors/domain-error'

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super('User with id ' + id + ' not found')
  }
}
