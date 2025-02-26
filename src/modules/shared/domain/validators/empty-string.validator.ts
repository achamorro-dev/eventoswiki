import { Validator } from './validator'

export class EmptyStringValidator extends Validator<string> {
  validate(): string | null {
    if (this.value.trim() === '') return 'El campo no puede estar vacío'
    return null
  }
}
