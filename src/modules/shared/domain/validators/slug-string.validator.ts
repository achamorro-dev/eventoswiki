import { SlugGenerator } from '@/shared/presentation/services/slugs/slug-generator'
import { Validator } from './validator'

export class SlugStringValidator extends Validator<string> {
  constructor(
    value: string,
    private readonly errorMessage: string = 'El título debe incluir texto suficiente para generar una URL válida',
  ) {
    super(value)
  }

  validate(): string | null {
    const slug = new SlugGenerator(this.value).generate()
    if (!slug || slug.trim() === '') {
      return this.errorMessage
    }

    try {
      const url = new URL(`http://acme.com/${slug}`)
      if (url.pathname !== `/${slug}`) {
        throw new Error()
      }

      return null
    } catch {
      return this.errorMessage
    }
  }
}
