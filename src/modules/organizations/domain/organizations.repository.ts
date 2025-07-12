import type { DeletableByIdRepository } from '@/shared/domain/repository/deletable-by-id-repository'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository'
import type { MatcheableRepository } from '@/shared/domain/repository/matcheable-repository'
import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { OrganizationsCriteria } from './criterias/organizations-criteria'
import type { OrganizationsFilters } from './criterias/organizations-filters'
import type { OrganizationsOrder } from './criterias/organizations-order'
import type { Organization } from './organization'
import type { OrganizationId } from './organization-id'

export interface OrganizationsRepository
  extends SaveableRepository<Organization>,
    FindableByIdRepository<OrganizationId, Organization>,
    DeletableByIdRepository<OrganizationId>,
    MatcheableRepository<
      Partial<OrganizationsFilters>,
      Partial<OrganizationsOrder>,
      OrganizationsCriteria,
      Organization
    > {
  findOrganizationsByUserId(userId: string): Promise<Organization[]>
  findByHandle(handle: string): Promise<Organization>
  updateFollowers(organization: Organization): Promise<void>
  findOrganizationsFollowedByUserId(userId: string): Promise<Organization[]>
}
