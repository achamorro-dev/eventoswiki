import { v4 as uuidv4 } from 'uuid'
import { ValueObject } from '@/shared/domain/value-object'

export class MeetupId extends ValueObject<string> {
  static create(): MeetupId {
    const value = uuidv4()
    return new MeetupId(value)
  }
}
