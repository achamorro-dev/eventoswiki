import { ValueObject } from '@/shared/domain/value-object'
import { MeetupTypeValidator } from './validators/meetup-type.validator'

export const MeetupTypes = {
  InPerson: 'inPerson',
  Online: 'online',
  Hybrid: 'hybrid',
}

export class MeetupType extends ValueObject<string> {
  static of(value: string): MeetupType
  static override of<T>(value: T): ValueObject<T>
  static override of<T>(value: T): MeetupType | ValueObject<T> {
    if (typeof value !== 'string') {
      throw new Error(`Invalid meetup type: expected string, got ${typeof value}`)
    }

    const validator = new MeetupTypeValidator(value as string)
    const error = validator.validate()
    if (error) {
      throw new Error(error)
    }

    return new MeetupType(value)
  }
}
