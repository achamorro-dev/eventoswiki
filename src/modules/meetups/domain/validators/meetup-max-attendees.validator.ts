import { Validator } from '@/shared/domain/validators/validator'

export class MeetupMaxAttendeesValidator extends Validator<number | null | undefined> {
  validate(): string | null {
    if (this.value === null || this.value === undefined) {
      return null
    }

    if (this.value < 1) {
      return 'El aforo debe ser al menos 1'
    }

    if (!Number.isInteger(this.value)) {
      return 'El aforo debe ser un número entero'
    }

    return null
  }
}
