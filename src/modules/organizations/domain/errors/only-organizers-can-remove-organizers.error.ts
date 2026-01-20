import { DomainError } from '@/shared/domain/errors/domain-error'

export class OnlyOrganizersCanRemoveOrganizersError extends DomainError {
  constructor() {
    super('Only organizers can remove organizers')
  }
}
