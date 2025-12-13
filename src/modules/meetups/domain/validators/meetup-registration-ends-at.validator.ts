import { Datetime } from '@/shared/domain/datetime/datetime'
import { Validator } from '@/shared/domain/validators/validator'

export class MeetupRegistrationEndsAtValidator extends Validator<Date | null | undefined> {
  validate(): string | null {
    if (!this.value) {
      return null
    }

    if (Datetime.isBefore(this.value, Datetime.now())) {
      return 'La fecha de fin de registro debe ser futura'
    }

    return null
  }
}
