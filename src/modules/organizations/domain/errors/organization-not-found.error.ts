import { DomainError } from '@/shared/domain/errors/domain-error'

export class OrganizationNotFound extends DomainError {
  constructor(handle: string) {
    super('Organization with handle ' + handle + ' not found')
  }
}
