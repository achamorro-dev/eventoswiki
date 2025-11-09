import { Validator } from '@/shared/domain/validators/validator'
import { MeetupTypes } from '../meetup-type'

export class MeetupTypeValidator extends Validator<string> {
  validate(): string | null {
    const allTypes = Object.values(MeetupTypes)
    if (!allTypes.includes(this.value)) return 'El tipo de meetup no es válido'

    return null
  }
}
