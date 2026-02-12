import { v4 as uuidv4 } from 'uuid'
import type { OrganizationId } from '@/organizations/domain/organization-id'
import type { Place } from '@/places/domain/place'
import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Agenda, type AgendaPrimitives } from './agenda/agenda'
import { InvalidEventError } from './errors/invalid-event.error'
import { EventId } from './event-id'
import { EventPlace } from './event-place'
import { EventType, EventTypes } from './event-type'
import type { TicketPrimitives } from './ticket'
import { TicketCollection } from './ticket-collection'
import { EventValidator } from './validators/event.validator'

export type EventPrimitives = {
  id: string
  slug: string
  title: string
  shortDescription: string
  startsAt: string
  endsAt: string
  image: string
  type: string
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
  streamingUrl?: string
  tags: string[]
  tagColor: string
  content: string
  organizationId?: string
  place?: {
    id: string
    name: string
    address: string
  }
  tickets: Array<{
    name: string
    price: number
  }>
  callForSponsorsEnabled: boolean
  callForSponsorsContent?: string
  callForSpeakersEnabled: boolean
  callForSpeakersStartsAt?: string
  callForSpeakersEndsAt?: string
  callForSpeakersContent?: string
  agenda?: AgendaPrimitives
}

export class Event implements EventProps {
  id: EventId
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  image: URL
  type: EventType
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
  streamingUrl?: string
  tags: string[]
  tagColor: string
  content: string
  organizationId?: string
  place?: EventPlace
  tickets: TicketCollection
  callForSponsorsEnabled: boolean
  callForSponsorsContent?: string
  callForSpeakersEnabled: boolean
  callForSpeakersStartsAt?: Date
  callForSpeakersEndsAt?: Date
  callForSpeakersContent?: string
  agenda?: Agenda

  private constructor(props: EventProps) {
    this.id = props.id
    this.slug = props.slug
    this.title = props.title
    this.shortDescription = props.shortDescription
    this.startsAt = props.startsAt
    this.endsAt = props.endsAt
    this.image = props.image
    this.type = props.type
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
    this.streamingUrl = props.streamingUrl
    this.tags = props.tags
    this.tagColor = props.tagColor
    this.content = props.content
    this.organizationId = props.organizationId || undefined
    this.place = props.place
    this.tickets = props.tickets
    this.callForSponsorsEnabled = props.callForSponsorsEnabled
    this.callForSponsorsContent = props.callForSponsorsContent
    this.callForSpeakersEnabled = props.callForSpeakersEnabled
    this.callForSpeakersStartsAt = props.callForSpeakersStartsAt
    this.callForSpeakersEndsAt = props.callForSpeakersEndsAt
    this.callForSpeakersContent = props.callForSpeakersContent
    this.agenda = props.agenda
  }

  static fromPrimitives(primitives: EventPrimitives): Event {
    return new Event({
      id: new EventId(primitives.id),
      slug: primitives.slug,
      title: primitives.title,
      shortDescription: primitives.shortDescription,
      startsAt: Datetime.toDate(primitives.startsAt),
      endsAt: Datetime.toDate(primitives.endsAt),
      image: new URL(primitives.image),
      type: EventType.of(primitives.type),
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
      streamingUrl: primitives.streamingUrl,
      tags: primitives.tags,
      tagColor: primitives.tagColor,
      content: primitives.content,
      organizationId: primitives.organizationId,
      place: primitives.place ? EventPlace.fromPrimitives(primitives.place) : undefined,
      tickets: TicketCollection.fromPrimitives(primitives.tickets || []),
      callForSponsorsEnabled: primitives.callForSponsorsEnabled ?? false,
      callForSponsorsContent: primitives.callForSponsorsContent ?? undefined,
      callForSpeakersEnabled: primitives.callForSpeakersEnabled ?? false,
      callForSpeakersStartsAt: primitives.callForSpeakersStartsAt
        ? new Date(primitives.callForSpeakersStartsAt)
        : undefined,
      callForSpeakersEndsAt: primitives.callForSpeakersEndsAt ? new Date(primitives.callForSpeakersEndsAt) : undefined,
      callForSpeakersContent: primitives.callForSpeakersContent ?? undefined,
      agenda: primitives.agenda ? Agenda.fromPrimitives(primitives.agenda as AgendaPrimitives) : undefined,
    })
  }

  toPrimitives(): EventPrimitives {
    return {
      id: this.id.value,
      slug: this.slug,
      title: this.title,
      shortDescription: this.shortDescription,
      startsAt: Datetime.toDateTimeIsoString(this.startsAt),
      endsAt: Datetime.toDateTimeIsoString(this.endsAt),
      image: this.image.toString(),
      type: this.type.value,
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
      streamingUrl: this.streamingUrl,
      tags: this.tags,
      tagColor: this.tagColor,
      content: this.content,
      organizationId: this.organizationId,
      place: this.place?.toPrimitives(),
      tickets: this.tickets.toPrimitives(),
      callForSponsorsEnabled: this.callForSponsorsEnabled,
      callForSponsorsContent: this.callForSponsorsContent ?? undefined,
      callForSpeakersEnabled: this.callForSpeakersEnabled,
      callForSpeakersStartsAt: this.callForSpeakersStartsAt?.toISOString() ?? undefined,
      callForSpeakersEndsAt: this.callForSpeakersEndsAt?.toISOString() ?? undefined,
      callForSpeakersContent: this.callForSpeakersContent ?? undefined,
      agenda: this.agenda ? this.agenda.toPrimitives() : undefined,
    }
  }

  static create(data: EventEditableData, organizationId: string) {
    Event.ensureIsValidEvent(data)

    const normalizedStartsAt = data.startsAt
      ? data.startsAt instanceof Date
        ? Datetime.toDateTimeIsoString(data.startsAt)
        : data.startsAt
      : Datetime.toDateTimeIsoString(new Date())
    const normalizedEndsAt = data.endsAt
      ? data.endsAt instanceof Date
        ? Datetime.toDateTimeIsoString(data.endsAt)
        : data.endsAt
      : Datetime.toDateTimeIsoString(new Date())

    const event = Event.fromPrimitives({
      slug: data.slug ?? '',
      title: data.title ?? '',
      shortDescription: data.shortDescription ?? '',
      startsAt: normalizedStartsAt,
      endsAt: normalizedEndsAt,
      image: data.image ?? '',
      type: data.type ?? EventTypes.InPerson,
      location: data.location ?? null,
      web: data.web,
      twitter: data.twitter,
      linkedin: data.linkedin,
      youtube: data.youtube,
      twitch: data.twitch,
      facebook: data.facebook,
      instagram: data.instagram,
      github: data.github,
      telegram: data.telegram,
      whatsapp: data.whatsapp,
      discord: data.discord,
      tiktok: data.tiktok,
      streamingUrl: data.streamingUrl,
      tags: data.tags ?? [],
      tagColor: data.tagColor ?? '#000000',
      content: data.content ?? '',
      organizationId,
      id: uuidv4(),
      place: data.place,
      tickets: data.tickets ?? [],
      callForSponsorsEnabled: false,
      callForSponsorsContent: undefined,
      callForSpeakersEnabled: false,
      callForSpeakersStartsAt: undefined,
      callForSpeakersEndsAt: undefined,
      callForSpeakersContent: undefined,
      agenda: undefined,
    })

    return event
  }

  private static ensureIsValidEvent(data: EventEditableData) {
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

  update(data: EventEditableData) {
    Event.ensureIsValidEvent(data)

    this.title = data.title ?? this.title
    this.shortDescription = data.shortDescription ?? this.shortDescription
    this.startsAt = data.startsAt
      ? data.startsAt instanceof Date
        ? data.startsAt
        : Datetime.toDate(data.startsAt)
      : this.startsAt
    this.endsAt = data.endsAt ? (data.endsAt instanceof Date ? data.endsAt : Datetime.toDate(data.endsAt)) : this.endsAt
    this.image = data.image ? new URL(data.image) : this.image
    this.type = data.type ? EventType.of(data.type) : this.type
    this.location = data.location ?? this.location
    this.web = data.web ?? this.web
    this.twitter = data.twitter ?? this.twitter
    this.linkedin = data.linkedin ?? this.linkedin
    this.youtube = data.youtube ?? this.youtube
    this.twitch = data.twitch ?? this.twitch
    this.facebook = data.facebook ?? this.facebook
    this.instagram = data.instagram ?? this.instagram
    this.github = data.github ?? this.github
    this.telegram = data.telegram ?? this.telegram
    this.whatsapp = data.whatsapp ?? this.whatsapp
    this.discord = data.discord ?? this.discord
    this.tiktok = data.tiktok ?? this.tiktok
    this.streamingUrl = data.streamingUrl ?? this.streamingUrl
    this.tags = data.tags ?? this.tags
    this.tagColor = data.tagColor ?? this.tagColor
    this.content = data.content ?? this.content
    this.slug = data.slug ?? this.slug
    this.place = data.place ? EventPlace.fromPrimitives(data.place) : this.place
    if (data.tickets) {
      this.tickets = TicketCollection.fromPrimitives(data.tickets)
    }
    this.callForSponsorsEnabled = data.callForSponsorsEnabled ?? this.callForSponsorsEnabled
    this.callForSponsorsContent = data.callForSponsorsContent ?? this.callForSponsorsContent
    this.callForSpeakersEnabled = data.callForSpeakersEnabled ?? this.callForSpeakersEnabled
    this.callForSpeakersStartsAt = data.callForSpeakersStartsAt
      ? data.callForSpeakersStartsAt instanceof Date
        ? data.callForSpeakersStartsAt
        : Datetime.toDate(data.callForSpeakersStartsAt)
      : this.callForSpeakersStartsAt
    this.callForSpeakersEndsAt = data.callForSpeakersEndsAt
      ? data.callForSpeakersEndsAt instanceof Date
        ? data.callForSpeakersEndsAt
        : Datetime.toDate(data.callForSpeakersEndsAt)
      : this.callForSpeakersEndsAt
    this.callForSpeakersContent = data.callForSpeakersContent ?? this.callForSpeakersContent
    if (data.agenda) {
      this.agenda = Agenda.fromPrimitives(data.agenda as AgendaPrimitives)
    }
  }

  isOrganizedBy(organizationId: OrganizationId): boolean {
    return this.organizationId === organizationId.value
  }

  hasOrganization(): boolean {
    return this.organizationId !== undefined
  }

  getMinTicketPrice(): number | null {
    return this.tickets.getMinPrice()
  }

  hasCallForSponsors(): boolean {
    return this.callForSponsorsEnabled && !!this.callForSponsorsContent
  }

  hasCallForSpeakers(): boolean {
    return (
      this.callForSpeakersEnabled &&
      !!this.callForSpeakersContent &&
      !!this.callForSpeakersStartsAt &&
      !!this.callForSpeakersEndsAt
    )
  }

  isCallForSpeakersActive(): boolean {
    if (!this.hasCallForSpeakers()) return false

    const now = new Date()
    // biome-ignore lint/style/noNonNullAssertion: hasCallForSpeakers checks for non-null values
    return now >= this.callForSpeakersStartsAt! && now <= this.callForSpeakersEndsAt!
  }

  hasAgenda(): boolean {
    return !!this.agenda && !this.agenda.isEmpty()
  }
}

export interface EventProps {
  id: EventId
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  image: URL
  type: EventType
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
  streamingUrl?: string
  tags: string[]
  tagColor: string
  content: string
  organizationId?: string | null
  place?: EventPlace
  tickets: TicketCollection
  callForSponsorsEnabled: boolean
  callForSponsorsContent?: string
  callForSpeakersEnabled: boolean
  callForSpeakersStartsAt?: Date
  callForSpeakersEndsAt?: Date
  callForSpeakersContent?: string
  agenda?: Agenda
}

export type EventEditableData = {
  slug?: string
  title?: string
  shortDescription?: string
  startsAt?: string | Date
  endsAt?: string | Date
  image?: string
  type?: string
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
  streamingUrl?: string
  tags?: string[]
  tagColor?: string
  content?: string
  place?: Primitives<Place>
  tickets?: TicketPrimitives[]
  callForSponsorsEnabled?: boolean
  callForSponsorsContent?: string
  callForSpeakersEnabled?: boolean
  callForSpeakersStartsAt?: string | Date
  callForSpeakersEndsAt?: string | Date
  callForSpeakersContent?: string
  agenda?: AgendaPrimitives
}
