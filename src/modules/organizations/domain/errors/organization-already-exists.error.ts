import { DomainError } from '@/shared/domain/errors/domain-error'

export class OrganizationAlreadyExists extends DomainError {
  constructor(handle: string) {
    super('Organization with handle ' + handle + ' already exists')
  }
}
