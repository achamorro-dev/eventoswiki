import { UrlValidator } from '@/shared/domain/validators/url.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class OrganizationImageValidator extends Validator<string | null> {
  validate(): string | null {
    if (this.value === null) return null

    return new UrlValidator(this.value).validate()
  }
}
