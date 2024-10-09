import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Primitives } from '../../shared/domain/primitives/primitives'

export class Event implements EventProps {
  readonly slug: string
  readonly title: string
  readonly shortDescription: string
  readonly startsAt: Date
  readonly endsAt: Date
  readonly thumbnail: string
  readonly image: string
  readonly altImage?: string
  readonly location: string
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
  readonly tags: string[]
  readonly tagColor: string
  readonly content: string

  private constructor(props: EventProps) {
    this.slug = props.slug
    this.title = props.title
    this.shortDescription = props.shortDescription
    this.startsAt = props.startsAt
    this.endsAt = props.endsAt
    this.thumbnail = props.thumbnail
    this.image = props.image
    this.altImage = props.altImage
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
    this.tags = props.tags
    this.tagColor = props.tagColor
    this.content = props.content
  }

  static fromPrimitives(primitives: Primitives<Event>): Event {
    return new Event({
      slug: primitives.slug,
      title: primitives.title,
      shortDescription: primitives.shortDescription,
      startsAt: Datetime.toDate(primitives.startsAt),
      endsAt: Datetime.toDate(primitives.endsAt),
      thumbnail: primitives.thumbnail,
      image: primitives.image,
      altImage: primitives.altImage,
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
      tags: primitives.tags,
      tagColor: primitives.tagColor,
      content: primitives.content,
    })
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
}

interface EventProps {
  slug: string
  title: string
  shortDescription: string
  startsAt: Date
  endsAt: Date
  thumbnail: string
  altImage?: string
  image: string
  location: string
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
  tags: string[]
  tagColor: string
  content: string
}
