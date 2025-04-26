import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { Organization } from './organization'

export interface OrganizationsRepository extends SaveableRepository<Organization> {
  findOrganizationsByUserId(userId: string): Promise<Organization[]>
}
