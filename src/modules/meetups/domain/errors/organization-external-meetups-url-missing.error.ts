import { DomainError } from '@/shared/domain/errors/domain-error'
import type { ExternalMeetupsSource } from '../external-meetups-source'

export class OrganizationExternalMeetupsUrlMissing extends DomainError {
  constructor(organizationId: string, source: ExternalMeetupsSource) {
    super(`Organization ${organizationId} has no ${source} url configured`)
  }
}
