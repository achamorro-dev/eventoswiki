import { Validator } from '@/shared/domain/validators/validator'

export class EventPeriodValidator extends Validator<{ startsAt: Date; endsAt: Date }> {
  validate(): string | null {
    if (this.value.startsAt > this.value.endsAt) {
      return 'La fecha de inicio no puede ser mayor que la fecha de fin'
    }

    return null
  }
}
