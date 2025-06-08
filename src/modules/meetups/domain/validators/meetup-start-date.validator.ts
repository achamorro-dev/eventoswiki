import { DateValidator } from '@/shared/domain/validators/date.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class MeetupStartDateValidator extends Validator<Date> {
  validate(): string | null {
    return new DateValidator(this.value).validate()
  }
}
