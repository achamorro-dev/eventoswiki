import type { OrganizationId } from '@/organizations/domain/organization-id'
import { Datetime } from '@/shared/domain/datetime/datetime'
import { v4 as uuidv4 } from 'uuid'
import type { Primitives } from '../../shared/domain/primitives/primitives'
import { InvalidEventError } from './errors/invalid-event.error'
import { EventValidator } from './validators/event.validator'

export class Event implements EventProps {
  id: string
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  image: URL
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
  tags: string[]
  tagColor: string
  content: string
  organizationId?: string

  private constructor(props: EventProps) {
    this.id = props.id
    this.slug = props.slug
    this.title = props.title
    this.shortDescription = props.shortDescription
    this.startsAt = props.startsAt
    this.endsAt = props.endsAt
    this.image = props.image
    this.location = props.location || null
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
    this.tags = props.tags
    this.tagColor = props.tagColor
    this.content = props.content
    this.organizationId = props.organizationId || undefined
  }

  static fromPrimitives(primitives: Primitives<Event>): Event {
    return new Event({
      id: primitives.id,
      slug: primitives.slug,
      title: primitives.title,
      shortDescription: primitives.shortDescription,
      startsAt: Datetime.toDate(primitives.startsAt),
      endsAt: Datetime.toDate(primitives.endsAt),
      image: new URL(primitives.image),
      location: primitives.location,
      web: primitives.web,
      twitter: primitives.twitter,
      linkedin: primitives.linkedin,
      youtube: primitives.youtube,
      twitch: primitives.twitch,
      facebook: primitives.facebook,
      instagram: primitives.instagram,
      github: primitives.github,
      telegram: primitives.telegram,
      whatsapp: primitives.whatsapp,
      discord: primitives.discord,
      tiktok: primitives.tiktok,
      tags: primitives.tags,
      tagColor: primitives.tagColor,
      content: primitives.content,
      organizationId: primitives.organizationId,
    })
  }

  static create(data: EventData, organizationId: string) {
    this.ensureIsValidEvent(data)

    const event = Event.fromPrimitives({
      ...data,
      organizationId,
      id: uuidv4(),
      location: data.location ?? null,
    })

    return event
  }

  private static ensureIsValidEvent(data: EventData) {
    const validator = new EventValidator(data)
    const error = validator.validate()

    if (error) throw new InvalidEventError(error)
  }

  getStartDateFormatted(): string {
    return Datetime.toDateString(this.startsAt)
  }

  getEndDateFormatted(): string {
    return Datetime.toDateString(this.endsAt)
  }

  occursOnSameDay(): boolean {
    return Datetime.toDateIsoString(this.startsAt) === Datetime.toDateIsoString(this.endsAt)
  }

  update(data: EventData) {
    Event.ensureIsValidEvent(data)

    this.title = data.title ?? this.title
    this.shortDescription = data.shortDescription ?? this.shortDescription
    this.startsAt = Datetime.toDate(data.startsAt) ?? this.startsAt
    this.endsAt = Datetime.toDate(data.endsAt) ?? this.endsAt
    this.image = new URL(data.image) ?? this.image
    this.location = data.location ?? this.location
    this.web = data.web ?? this.web
    this.twitter = data.twitter ?? this.twitter
    this.linkedin = data.linkedin ?? this.linkedin
    this.youtube = data.youtube ?? this.youtube
    this.twitch = data.twitch ?? this.twitch
    this.facebook = data.facebook ?? this.facebook
    this.tags = data.tags ?? this.tags
    this.tagColor = data.tagColor ?? this.tagColor
  }

  isOrganizedBy(organizationId: OrganizationId): boolean {
    return this.organizationId === organizationId.value
  }
}

export interface EventProps {
  id: string
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  image: URL
  location?: string | null
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
  tags: string[]
  tagColor: string
  content: string
  organizationId?: string | null
}

export type EventData = Primitives<Omit<EventProps, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>
