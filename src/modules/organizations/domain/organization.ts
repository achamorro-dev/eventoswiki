import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { InvalidOrganizationError } from './errors/invalid-organization.error'
import { OrganizationId } from './organization-id'
import { OrganizationValidator } from './validators/organization.validator'

export interface OrganizationProps {
  readonly id: OrganizationId
  handle: string
  name: string
  bio: string
  image?: URL
  organizers: string[]
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
  createdAt: Date
  updatedAt: Date
  followers: string[]
}

export type OrganizationData = Primitives<Omit<OrganizationProps, 'id' | 'createdAt' | 'updatedAt' | 'organizers'>>

export class Organization implements OrganizationProps {
  readonly id: OrganizationId
  handle: string
  name: string
  bio: string
  image?: URL
  organizers: string[]
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
  createdAt: Date
  updatedAt: Date
  followers: string[]

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
    this.followers = props.followers
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
      followers: [],
    })
  }

  static fromPrimitives(primitives: Primitives<Organization>): Organization {
    return new Organization({
      ...primitives,
      image: primitives.image ? new URL(primitives.image) : undefined,
      id: OrganizationId.of(primitives.id),
      createdAt: Datetime.toDate(primitives.createdAt),
      updatedAt: Datetime.toDate(primitives.updatedAt),
      followers: primitives.followers,
    })
  }

  toPrimitives(): Primitives<Organization> {
    return {
      id: this.id.value,
      handle: this.handle,
      name: this.name,
      bio: this.bio,
      image: this.image?.toString(),
      organizers: this.organizers,
      location: this.location,
      web: this.web,
      twitter: this.twitter,
      linkedin: this.linkedin,
      youtube: this.youtube,
      twitch: this.twitch,
      facebook: this.facebook,
      instagram: this.instagram,
      github: this.github,
      telegram: this.telegram,
      whatsapp: this.whatsapp,
      discord: this.discord,
      tiktok: this.tiktok,
      createdAt: Datetime.toDateIsoString(this.createdAt),
      updatedAt: Datetime.toDateIsoString(this.updatedAt),
      followers: this.followers,
      followersCount: this.followersCount,
    }
  }

  addOrganizer(organizerId: string) {
    if (!this.organizers.includes(organizerId)) {
      this.organizers.push(organizerId)
    }
  }

  imageUrlString() {
    return this.image?.toString()
  }

  firstNameLetter() {
    return this.name.charAt(0)
  }

  isOrganizer(organizerId: string) {
    return this.organizers.includes(organizerId)
  }

  followersCount() {
    return this.followers.length
  }

  update(newOrganizationData: OrganizationData) {
    Organization.ensureIsValidOrganization(newOrganizationData)

    this.handle = newOrganizationData.handle ?? this.handle
    this.name = newOrganizationData.name ?? this.name
    this.bio = newOrganizationData.bio ?? this.bio
    this.image = newOrganizationData.image ? new URL(newOrganizationData.image) : this.image
    this.location = newOrganizationData.location ?? this.location
    this.web = newOrganizationData.web ?? this.web
    this.twitter = newOrganizationData.twitter ?? this.twitter
    this.linkedin = newOrganizationData.linkedin ?? this.linkedin
    this.youtube = newOrganizationData.youtube ?? this.youtube
    this.twitch = newOrganizationData.twitch ?? this.twitch
    this.facebook = newOrganizationData.facebook ?? this.facebook
    this.instagram = newOrganizationData.instagram ?? this.instagram
    this.github = newOrganizationData.github ?? this.github
    this.telegram = newOrganizationData.telegram ?? this.telegram
    this.whatsapp = newOrganizationData.whatsapp ?? this.whatsapp
    this.discord = newOrganizationData.discord ?? this.discord
    this.tiktok = newOrganizationData.tiktok ?? this.tiktok
  }

  addFollower(userId: string) {
    if (!this.followers.includes(userId)) {
      this.followers.push(userId)
    }
  }

  isFollower(userId: string) {
    return this.followers.includes(userId)
  }

  removeFollower(userId: string) {
    this.followers = this.followers.filter(follower => follower !== userId)
  }

  private static ensureIsValidOrganization(organization: OrganizationData) {
    const validator = new OrganizationValidator(organization)
    const error = validator.validate()

    if (error) throw new InvalidOrganizationError(error)
  }
}
