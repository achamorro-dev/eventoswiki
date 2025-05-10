import { Validator } from './validator'

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})([/\w .-]*)*(\/?|\?[^\s]*)?$/

export class OptionalUrlValidator extends Validator<string | null> {
  validate(): string | null {
    if (!this.value) return null

    if (!URL_REGEX.test(this.value)) return 'La URL no es válida'

    return null
  }
}
