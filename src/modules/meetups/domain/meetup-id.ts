import { ValueObject } from '@/shared/domain/value-object'
import { v4 as uuidv4 } from 'uuid'

export class MeetupId extends ValueObject<string> {
  static create(): MeetupId {
    const value = uuidv4()
    return new MeetupId(value)
  }
}
