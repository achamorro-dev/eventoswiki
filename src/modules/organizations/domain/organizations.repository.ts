import type { Organization } from './organization'

export interface OrganizationsRepository {
  findOrganizationsByUserId(userId: string): Promise<Organization[]>
}
