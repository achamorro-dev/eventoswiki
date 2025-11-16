import { Validator } from '@/shared/domain/validators/validator'
import { EventTypes } from '../event-type'

export class EventTypeValidator extends Validator<string> {
  validate(): string | null {
    const allTypes = Object.values(EventTypes)
    if (!allTypes.includes(this.value)) return 'El tipo de evento no es válido'

    return null
  }
}
