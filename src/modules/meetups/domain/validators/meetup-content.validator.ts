import { MinLengthStringValidator } from '@/shared/domain/validators/min-length-string.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class MeetupContentValidator extends Validator<string> {
  validate(): string | null {
    return new MinLengthStringValidator(this.value, 10).validate()
  }
}
