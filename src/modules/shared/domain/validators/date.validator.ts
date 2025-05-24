import { Validator } from './validator'

export class DateValidator extends Validator<Date> {
  constructor(value: Date) {
    super(value)
  }

  validate(): string | null {
    return null
  }
}
