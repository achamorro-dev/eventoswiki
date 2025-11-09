import type { OrganizationId } from '@/organizations/domain/organization-id'
import { DateFormat, Datetime } from '@/shared/domain/datetime/datetime'
import { v4 as uuidv4 } from 'uuid'
import type { Primitives } from '../../shared/domain/primitives/primitives'
import { InvalidMeetupError } from './errors/invalid-meetup.error'
import { MeetupAttendeeDoesNotExist } from './errors/meetup-attendee-does-not-exist.error'
import { MeetupAttendeeId } from './meetup-attendee-id'
import { MeetupId } from './meetup-id'
import { MeetupType } from './meetup-type'
import { MeetupValidator } from './validators/meetup.validator'

export class Meetup implements MeetupProps {
  id: MeetupId
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  image: URL
  type: MeetupType
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
  attendees?: MeetupAttendeeId[]

  private constructor(props: MeetupProps) {
    this.id = props.id
    this.slug = props.slug
    this.title = props.title
    this.shortDescription = props.shortDescription
    this.startsAt = props.startsAt
    this.endsAt = props.endsAt
    this.image = props.image
    this.type = props.type
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
    this.tags = props.tags
    this.tagColor = props.tagColor
    this.content = props.content
    this.organizationId = props.organizationId || undefined
    this.attendees = props.attendees || undefined
  }

  static create(data: MeetupData, organizationId: string) {
    this.ensureIsValidMeetup(data)

    const meetup = Meetup.fromPrimitives({
      ...data,
      organizationId,
      id: uuidv4(),
      location: data.location ?? null,
    })

    return meetup
  }

  static fromPrimitives(primitives: Primitives<Meetup>): Meetup {
    return new Meetup({
      id: new MeetupId(primitives.id),
      slug: primitives.slug,
      title: primitives.title,
      shortDescription: primitives.shortDescription,
      startsAt: Datetime.toDate(primitives.startsAt),
      endsAt: Datetime.toDate(primitives.endsAt),
      image: new URL(primitives.image),
      type: MeetupType.of(primitives.type),
      location: primitives.location || null,
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
      attendees: primitives.attendees?.map(MeetupAttendeeId.of),
    })
  }

  toPrimitives(): Primitives<Meetup> {
    return {
      ...this,
      id: this.id.value,
      image: this.image.toString(),
      startsAt: Datetime.toDateTimeIsoString(this.startsAt),
      endsAt: Datetime.toDateTimeIsoString(this.endsAt),
      type: this.type.value,
      attendees: this.attendees?.map(attendee => attendee.value),
    }
  }

  getStartDateFormatted(): string {
    return Datetime.toDateString(this.startsAt, DateFormat.DD_MMM_YYYY)
  }

  getEndDateFormatted(): string {
    return Datetime.toDateString(this.endsAt)
  }

  occursOnSameDay(): boolean {
    return Datetime.toDateIsoString(this.startsAt) === Datetime.toDateIsoString(this.endsAt)
  }

  update(data: MeetupData) {
    Meetup.ensureIsValidMeetup(data)

    this.title = data.title ?? this.title
    this.shortDescription = data.shortDescription ?? this.shortDescription
    this.startsAt = Datetime.toDate(data.startsAt) ?? this.startsAt
    this.endsAt = Datetime.toDate(data.endsAt) ?? this.endsAt
    this.image = data.image ? new URL(data.image) : this.image
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
    this.tags = data.tags ?? this.tags
    this.tagColor = data.tagColor ?? this.tagColor
    this.content = data.content ?? this.content
    this.type = !!data.type ? MeetupType.of(data.type) : this.type
    this.slug = data.slug ?? this.slug
  }

  isOrganizedBy(organizationId: OrganizationId): boolean {
    return this.organizationId === organizationId.value
  }

  hasOrganization(): boolean {
    return this.organizationId !== undefined
  }

  addAttendee(attendeeId: MeetupAttendeeId) {
    if (!this.attendees) {
      this.attendees = [attendeeId]
      return
    }

    const isAttendeeAlreadyAdded = this.attendees.some(attendee => attendee.value === attendeeId.value)
    if (isAttendeeAlreadyAdded) {
      return
    }

    this.attendees.push(attendeeId)
  }

  removeAttendee(attendeeId: MeetupAttendeeId) {
    const attendeeDoesNotExist = !this.attendees?.some(attendee => attendee.value === attendeeId.value)

    if (!this.attendees || attendeeDoesNotExist) {
      throw new MeetupAttendeeDoesNotExist(attendeeId.value)
    }

    this.attendees = this.attendees.filter(attendee => attendee.value !== attendeeId.value)
  }

  isAttending(userId: string): boolean {
    return this.attendees?.some(attendee => attendee.value === userId) ?? false
  }

  isPast(): boolean {
    return Datetime.isBefore(this.endsAt, Datetime.now())
  }

  hasStarted(): boolean {
    return Datetime.isBefore(this.startsAt, Datetime.now())
  }

  private static ensureIsValidMeetup(data: MeetupData) {
    const validator = new MeetupValidator(data)
    const error = validator.validate()

    if (error) throw new InvalidMeetupError(error)
  }
}

export interface MeetupProps {
  id: MeetupId
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  image: URL
  location: string | null
  type: MeetupType
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
  attendees?: MeetupAttendeeId[]
}

export type MeetupData = Primitives<Omit<MeetupProps, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>>
