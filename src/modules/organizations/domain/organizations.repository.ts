import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { Organization } from './organization'
import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository'

export interface OrganizationsRepository
  extends SaveableRepository<Organization>,
    FindableByIdRepository<Organization['handle'], Organization> {
  findOrganizationsByUserId(userId: string): Promise<Organization[]>
}
