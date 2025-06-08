import { MinLengthStringValidator } from '@/shared/domain/validators/min-length-string.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class MeetupTitleValidator extends Validator<string> {
  validate(): string | null {
    return new MinLengthStringValidator(this.value, 3).validate()
  }
}
