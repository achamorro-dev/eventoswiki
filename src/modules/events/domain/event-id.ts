import { v4 as uuidv4 } from 'uuid'
import { ValueObject } from '@/shared/domain/value-object'

export class EventId extends ValueObject<string> {
  static create(): EventId {
    const value = uuidv4()
    return new EventId(value)
  }
}
