import { DateValidator } from '@/shared/domain/validators/date.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class MeetupRegistrationEndsAtValidator extends Validator<Date | null | undefined> {
  validate(): string | null {
    if (!this.value) {
      return null
    }

    return new DateValidator(this.value).validate()
  }
}
