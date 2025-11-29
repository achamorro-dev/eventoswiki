import { SlugGenerator } from '@/shared/presentation/services/slugs/slug-generator'
import { Validator } from './validator'

export class SlugStringValidator extends Validator<string> {
  constructor(
    value: string,
    private readonly errorMessage: string = 'El slug generado no es válido',
  ) {
    super(value)
  }

  validate(): string | null {
    const slug = new SlugGenerator(this.value).generate()
    try {
      const url = new URL('http://acme.com/' + slug)
      if (url.pathname !== '/' + slug) {
        throw new Error()
      }

      return null
    } catch {
      return this.errorMessage
    }
  }
}
