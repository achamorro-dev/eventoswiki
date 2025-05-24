import { SlugStringValidator } from '@/shared/domain/validators/slug-string.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class EventSlugValidator extends Validator<string> {
  validate(): string | null {
    return new SlugStringValidator(this.value).validate()
  }
}
