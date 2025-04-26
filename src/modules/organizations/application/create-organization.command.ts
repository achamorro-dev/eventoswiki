import { Command } from '@/shared/application/use-case/command'
import { Organization } from '../domain/organization'
import type { OrganizationsRepository } from '../domain/organizations.repository'

interface Param {
  handle: string
  name: string
  bio: string
  image?: string
  location: string | null
  web?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  twitch?: string
  facebook?: string
  instagram?: string
  github?: string
  telegram?: string
  whatsapp?: string
  discord?: string
  tiktok?: string
  organizerId: string
}
export class CreateOrganizationCommand extends Command<Param, void> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super()
  }

  async execute(param: Param): Promise<void> {
    const { organizerId, ...newOrganization } = param

    const organization = Organization.create(newOrganization)
    organization.addOrganizer(organizerId)

    await this.organizationsRepository.save(organization)
  }
}
