import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { InvalidOrganizationError } from './errors/invalid-organization.error'
import { OrganizationId } from './organization-id'
import { OrganizationValidator } from './validators/organization.validator'

export interface OrganizationProps {
  readonly id: OrganizationId
  readonly handle: string
  readonly name: string
  readonly bio: string
  readonly image?: URL
  readonly organizers: string[]
  readonly location: string | null
  readonly web?: string
  readonly twitter?: string
  readonly linkedin?: string
  readonly youtube?: string
  readonly twitch?: string
  readonly facebook?: string
  readonly instagram?: string
  readonly github?: string
  readonly telegram?: string
  readonly whatsapp?: string
  readonly discord?: string
  readonly tiktok?: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type OrganizationData = Primitives<Omit<OrganizationProps, 'id' | 'createdAt' | 'updatedAt' | 'organizers'>>

export class Organization implements OrganizationProps {
  readonly id: OrganizationId
  readonly handle: string
  readonly name: string
  readonly bio: string
  readonly image?: URL
  readonly organizers: string[]
  readonly location: string | null
  readonly web?: string
  readonly twitter?: string
  readonly linkedin?: string
  readonly youtube?: string
  readonly twitch?: string
  readonly facebook?: string
  readonly instagram?: string
  readonly github?: string
  readonly telegram?: string
  readonly whatsapp?: string
  readonly discord?: string
  readonly tiktok?: string
  readonly createdAt: Date
  readonly updatedAt: Date

  private constructor(props: OrganizationProps) {
    this.id = props.id
    this.handle = props.handle
    this.name = props.name
    this.bio = props.bio
    this.image = props.image
    this.organizers = props.organizers
    this.location = props.location
    this.web = props.web
    this.twitter = props.twitter
    this.linkedin = props.linkedin
    this.youtube = props.youtube
    this.twitch = props.twitch
    this.facebook = props.facebook
    this.instagram = props.instagram
    this.github = props.github
    this.telegram = props.telegram
    this.whatsapp = props.whatsapp
    this.discord = props.discord
    this.tiktok = props.tiktok
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(props: OrganizationData): Organization {
    this.ensureIsValidOrganization(props)

    return new Organization({
      ...props,
      id: OrganizationId.create(),
      image: props.image ? new URL(props.image) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      organizers: [],
    })
  }

  static fromPrimitives(primitives: Primitives<Organization>): Organization {
    return new Organization({
      ...primitives,
      image: primitives.image ? new URL(primitives.image) : undefined,
      id: OrganizationId.of(primitives.id),
      createdAt: Datetime.toDate(primitives.createdAt),
      updatedAt: Datetime.toDate(primitives.updatedAt),
    })
  }

  addOrganizer(organizerId: string) {
    if (!this.organizers.includes(organizerId)) {
      this.organizers.push(organizerId)
    }
  }

  private static ensureIsValidOrganization(organization: OrganizationData) {
    const validator = new OrganizationValidator(organization)
    const error = validator.validate()

    if (error) throw new InvalidOrganizationError(error)
  }
}
