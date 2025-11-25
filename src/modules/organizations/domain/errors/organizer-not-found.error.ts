import { DomainError } from '@/shared/domain/errors/domain-error'

export class OrganizerNotFound extends DomainError {
  constructor(id: string) {
    super('Organizer with id ' + id + ' not found')
  }
}
