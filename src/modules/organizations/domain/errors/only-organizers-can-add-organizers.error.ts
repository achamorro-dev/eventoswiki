import { DomainError } from '@/shared/domain/errors/domain-error'

export class OnlyOrganizersCanAddOrganizersError extends DomainError {
  constructor() {
    super('Only organizers can add new organizers')
  }
}
