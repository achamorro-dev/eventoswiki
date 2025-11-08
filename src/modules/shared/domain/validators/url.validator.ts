import { Validator } from './validator'

export class UrlValidator extends Validator<string> {
  constructor(value: string) {
    super(value)
  }

  validate(): string | null {
    try {
      const url = new URL(this.value)
      // Solo permitir http y https
      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'La URL no es válida'
      }
      return null
    } catch {
      return 'La URL no es válida'
    }
  }
}
