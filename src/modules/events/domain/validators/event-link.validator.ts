import { OptionalUrlValidator } from '@/shared/domain/validators/optional-url.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class EventLinkValidator extends Validator<string | null> {
  validate(): string | null {
    return new OptionalUrlValidator(this.value).validate()
  }
}
