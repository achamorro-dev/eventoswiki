import { DomainError } from '@/shared/domain/errors/domain-error'

export class CannotRemoveLastOrganizerError extends DomainError {
  constructor() {
    super('Cannot remove the last organizer from an organization')
  }
}
