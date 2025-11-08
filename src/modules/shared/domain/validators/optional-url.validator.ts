import { Validator } from './validator'

export class OptionalUrlValidator extends Validator<string | null> {
  validate(): string | null {
    if (!this.value) return null

    try {
      const url = new URL(this.value)
      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'La URL no es válida'
      }
      return null
    } catch {
      return 'La URL no es válida'
    }
  }
}
