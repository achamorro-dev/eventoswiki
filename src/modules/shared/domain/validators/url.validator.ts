import { Validator } from './validator'

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})([/\w .-]*)*(\/?|\?[^\s]*)?$/

export class UrlValidator extends Validator<string> {
  constructor(value: string) {
    super(value)
  }

  validate(): string | null {
    if (!URL_REGEX.test(this.value)) return 'La URL no es válida'

    return null
  }
}
