import { Validator } from './validator'

export class MinLengthStringValidator extends Validator<string> {
  constructor(
    value: string,
    private readonly minLength: number,
  ) {
    super(value)
  }

  validate(): string | null {
    if (this.value.trim().length < this.minLength) return `La longitud mínima es de ${this.minLength} caracteres`

    return null
  }
}
