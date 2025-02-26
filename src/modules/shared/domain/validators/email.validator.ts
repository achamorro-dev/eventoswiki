import { Validator } from './validator'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export class EmailValidator extends Validator<string> {
  constructor(value: string) {
    super(value)
  }

  validate(): string | null {
    if (!EMAIL_REGEX.test(this.value)) return 'El email no es válido'

    return null
  }
}
