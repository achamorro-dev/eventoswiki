import { Datetime } from '@/shared/domain/datetime/datetime'
import { ValueObject } from '@/shared/domain/value-object'

export type CommonElementType = 'coffee-break' | 'lunch' | 'registration' | 'keynote' | 'other'

export interface CommonElementProps {
  id: string
  title: string
  description?: string
  startsAt: Date
  endsAt: Date
  type: CommonElementType
}

export type CommonElementPrimitives = {
  id: string
  title: string
  description?: string
  startsAt: string // ISO datetime
  endsAt: string // ISO datetime
  type: CommonElementType
}

export class CommonElement extends ValueObject<CommonElementProps> {
  constructor(value: CommonElementProps) {
    CommonElement.ensureIsValid(value)
    super(value)
  }

  static fromPrimitives(primitives: CommonElementPrimitives): CommonElement {
    return new CommonElement({
      id: primitives.id,
      title: primitives.title,
      description: primitives.description,
      startsAt: new Date(primitives.startsAt),
      endsAt: new Date(primitives.endsAt),
      type: primitives.type,
    })
  }

  toPrimitives(): CommonElementPrimitives {
    return {
      id: this.value.id,
      title: this.value.title,
      description: this.value.description,
      startsAt: this.value.startsAt.toISOString(),
      endsAt: this.value.endsAt.toISOString(),
      type: this.value.type,
    }
  }

  static create(data: {
    id: string
    title: string
    description?: string
    startsAt: Date
    endsAt: Date
    type: CommonElementType
  }): CommonElement {
    return new CommonElement({
      id: data.id,
      title: data.title,
      description: data.description,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      type: data.type,
    })
  }

  private static ensureIsValid(data: CommonElementProps): void {
    const { title, startsAt, endsAt, type } = data

    if (typeof title !== 'string' || title.trim().length < 1) {
      throw new Error('El título del elemento común es obligatorio')
    }

    if (!(startsAt instanceof Date) || Number.isNaN(startsAt.getTime())) {
      throw new Error('La fecha de inicio del elemento común no es válida')
    }

    if (!(endsAt instanceof Date) || Number.isNaN(endsAt.getTime())) {
      throw new Error('La fecha de fin del elemento común no es válida')
    }

    if (endsAt <= startsAt) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio')
    }

    const validTypes: CommonElementType[] = ['coffee-break', 'lunch', 'registration', 'keynote', 'other']
    if (!validTypes.includes(type)) {
      throw new Error(`El tipo de elemento común debe ser uno de: ${validTypes.join(', ')}`)
    }
  }

  getId(): string {
    return this.value.id
  }

  getTitle(): string {
    return this.value.title
  }

  getDescription(): string | undefined {
    return this.value.description
  }

  getStartsAt(): Date {
    return this.value.startsAt
  }

  getEndsAt(): Date {
    return this.value.endsAt
  }

  getType(): CommonElementType {
    return this.value.type
  }

  getFormattedStartTime(): string {
    return Datetime.toTimeString(this.value.startsAt)
  }

  getFormattedEndTime(): string {
    return Datetime.toTimeString(this.value.endsAt)
  }

  overlapsWith(other: CommonElement): boolean {
    return (
      (this.value.startsAt < other.value.endsAt && this.value.endsAt > other.value.startsAt) ||
      (other.value.startsAt < this.value.endsAt && other.value.endsAt > this.value.startsAt)
    )
  }
}
