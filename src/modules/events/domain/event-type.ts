import { ValueObject } from '@/shared/domain/value-object'
import { EventTypeValidator } from './validators/event-type.validator'

export const EventTypes = {
  InPerson: 'inPerson',
  Online: 'online',
  Hybrid: 'hybrid',
}

export class EventType extends ValueObject<string> {
  static of(value: string): EventType
  static override of<T>(value: T): ValueObject<T>
  static override of<T>(value: T): EventType | ValueObject<T> {
    if (typeof value !== 'string') {
      throw new Error(`Invalid event type: expected string, got ${typeof value}`)
    }

    const validator = new EventTypeValidator(value as string)
    const error = validator.validate()
    if (error) {
      throw new Error(error)
    }

    return new EventType(value)
  }
}
