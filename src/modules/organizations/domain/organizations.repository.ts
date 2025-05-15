import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository'
import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { Organization } from './organization'
import type { OrganizationId } from './organization-id'

export interface OrganizationsRepository
  extends SaveableRepository<Organization>,
    FindableByIdRepository<OrganizationId, Organization> {
  findOrganizationsByUserId(userId: string): Promise<Organization[]>

  findByHandle(handle: string): Promise<Organization>
}
