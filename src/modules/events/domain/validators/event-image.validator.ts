import { UrlValidator } from '@/shared/domain/validators/url.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class EventImageValidator extends Validator<string> {
  validate(): string | null {
    return new UrlValidator(this.value).validate()
  }
}
