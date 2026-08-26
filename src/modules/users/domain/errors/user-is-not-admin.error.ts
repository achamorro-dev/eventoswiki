import { DomainError } from '@/shared/domain/errors/domain-error'

export class UserIsNotAdminError extends DomainError {
  constructor(id: string) {
    super(`User with id ${id} is not an admin`)
  }
}
