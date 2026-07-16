import { DomainError } from '@/shared/domain/errors/domain-error'

export class OrganizationMeetupUrlMissing extends DomainError {
  constructor(organizationId: string) {
    super(`Organization ${organizationId} has no meetup.com group url configured`)
  }
}
