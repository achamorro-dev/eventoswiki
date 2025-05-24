import { DateValidator } from '@/shared/domain/validators/date.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class EventEndDateValidator extends Validator<Date> {
  validate(): string | null {
    return new DateValidator(this.value).validate()
  }
}
