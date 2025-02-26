import { Validator } from './validator'

export class FormatStringValidator extends Validator<string> {
  constructor(
    value: string,
    private readonly format: RegExp,
    private readonly errorMessage: string = 'El formato es incorrecto',
  ) {
    super(value)
  }

  validate(): string | null {
    if (!this.format.test(this.value)) return this.errorMessage

    return null
  }
}
