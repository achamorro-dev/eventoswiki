import { MinLengthStringValidator } from '@/shared/domain/validators/min-length-string.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class OrganizationLocationValidator extends Validator<string | null> {
  validate(): string | null {
    if (!this.value) return null

    return new MinLengthStringValidator(this.value, 3).validate()
  }
}
