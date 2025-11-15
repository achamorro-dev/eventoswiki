import { FormatStringValidator } from '@/shared/domain/validators/format-string.validator'
import { Validator } from '@/shared/domain/validators/validator'

const USERNAME_REGEX = /^[a-zA-Z\-_.][a-zA-Z0-9\-_.]*$/
export class UserUsernameValidator extends Validator<string> {
  validate(): string | null {
    return new FormatStringValidator(
      this.value,
      USERNAME_REGEX,
      'El nombre de usuario no puede contener espacios, caracteres especiales o empezar con un número',
    ).validate()
  }
}
