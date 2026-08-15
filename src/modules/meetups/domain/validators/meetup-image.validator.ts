import { UrlValidator } from '@/shared/domain/validators/url.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class MeetupImageValidator extends Validator<string | null | undefined> {
  validate(): string | null {
    if (!this.value) return null

    return new UrlValidator(this.value).validate()
  }
}
