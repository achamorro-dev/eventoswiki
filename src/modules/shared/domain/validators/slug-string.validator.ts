import { Validator } from './validator'

export class SlugStringValidator extends Validator<string> {
  private readonly slugRegex = /^[a-z0-9/]+(?:-[a-z0-9/]+)*$/

  constructor(
    value: string,
    private readonly errorMessage: string = 'El formato es incorrecto',
  ) {
    super(value)
  }

  validate(): string | null {
    if (!this.slugRegex.test(this.value)) return this.errorMessage

    return null
  }
}
