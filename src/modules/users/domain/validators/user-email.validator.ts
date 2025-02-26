import { EmailValidator } from '@/shared/domain/validators/email.validator'
import { Validator } from '@/shared/domain/validators/validator'

export class UserEmailValidator extends Validator<string | null> {
  validate(): string | null {
    if (!this.value) return null

    return new EmailValidator(this.value).validate()
  }
}
