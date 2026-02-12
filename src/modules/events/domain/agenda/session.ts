import { Datetime } from '@/shared/domain/datetime/datetime'
import { ValueObject } from '@/shared/domain/value-object'
import { Speaker, type SpeakerPrimitives } from './speaker'

export interface SessionProps {
  id: string
  title: string
  description: string
  image?: string
  categories?: string[]
  language?: string
  startsAt: Date
  endsAt: Date
  speakers: Speaker[]
}

export type SessionPrimitives = {
  id: string
  title: string
  description: string
  image?: string
  categories?: string[]
  language?: string
  startsAt: string // ISO datetime
  endsAt: string // ISO datetime
  speakers: SpeakerPrimitives[]
}

export class Session extends ValueObject<SessionProps> {
  constructor(value: SessionProps) {
    Session.ensureIsValid(value)
    super(value)
  }

  static fromPrimitives(primitives: SessionPrimitives): Session {
    return new Session({
      id: primitives.id,
      title: primitives.title,
      description: primitives.description,
      image: primitives.image,
      categories: primitives.categories,
      language: primitives.language,
      startsAt: new Date(primitives.startsAt),
      endsAt: new Date(primitives.endsAt),
      speakers: primitives.speakers.map(s => Speaker.fromPrimitives(s)),
    })
  }

  toPrimitives(): SessionPrimitives {
    return {
      id: this.value.id,
      title: this.value.title,
      description: this.value.description,
      image: this.value.image,
      categories: this.value.categories,
      language: this.value.language,
      startsAt: this.value.startsAt.toISOString(),
      endsAt: this.value.endsAt.toISOString(),
      speakers: this.value.speakers.map(s => s.toPrimitives()),
    }
  }

  static create(data: {
    id: string
    title: string
    description: string
    image?: string
    categories?: string[]
    language?: string
    startsAt: Date
    endsAt: Date
    speakers?: Speaker[]
  }): Session {
    return new Session({
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      categories: data.categories,
      language: data.language,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      speakers: data.speakers || [],
    })
  }

  private static ensureIsValid(data: SessionProps): void {
    const { title, description, startsAt, endsAt } = data

    if (typeof title !== 'string' || title.trim().length < 1) {
      throw new Error('El título de la sesión es obligatorio')
    }

    if (typeof description !== 'string' || description.trim().length < 1) {
      throw new Error('La descripción de la sesión es obligatoria')
    }

    if (!(startsAt instanceof Date) || Number.isNaN(startsAt.getTime())) {
      throw new Error('La fecha de inicio de la sesión no es válida')
    }

    if (!(endsAt instanceof Date) || Number.isNaN(endsAt.getTime())) {
      throw new Error('La fecha de fin de la sesión no es válida')
    }

    if (endsAt <= startsAt) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio')
    }
  }

  getId(): string {
    return this.value.id
  }

  getTitle(): string {
    return this.value.title
  }

  getDescription(): string {
    return this.value.description
  }

  getImage(): string | undefined {
    return this.value.image
  }

  getCategories(): string[] | undefined {
    return this.value.categories
  }

  getLanguage(): string | undefined {
    return this.value.language
  }

  getStartsAt(): Date {
    return this.value.startsAt
  }

  getEndsAt(): Date {
    return this.value.endsAt
  }

  getSpeakers(): Speaker[] {
    return [...this.value.speakers]
  }

  getFormattedStartTime(): string {
    return Datetime.toTimeString(this.value.startsAt)
  }

  getFormattedEndTime(): string {
    return Datetime.toTimeString(this.value.endsAt)
  }

  getFormattedDate(): string {
    return Datetime.toDateIsoString(this.value.startsAt)
  }

  hasImage(): boolean {
    return !!this.value.image
  }

  hasCategories(): boolean {
    return !!this.value.categories && this.value.categories.length > 0
  }

  hasSpeakers(): boolean {
    return this.value.speakers.length > 0
  }

  overlapsWith(other: Session): boolean {
    return (
      (this.value.startsAt < other.value.endsAt && this.value.endsAt > other.value.startsAt) ||
      (other.value.startsAt < this.value.endsAt && other.value.endsAt > this.value.startsAt)
    )
  }

  getDuration(): number {
    return this.value.endsAt.getTime() - this.value.startsAt.getTime()
  }

  getDurationInMinutes(): number {
    return this.getDuration() / (1000 * 60)
  }

  addSpeaker(speaker: Speaker): void {
    this.value.speakers.push(speaker)
  }

  removeSpeaker(speakerId: string): void {
    this.value.speakers = this.value.speakers.filter(s => s.getId() !== speakerId)
  }
}
