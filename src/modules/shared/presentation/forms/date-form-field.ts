import { z } from 'astro/zod'
import type { ValidatorConstructor } from '@/shared/domain/validators/validator'
import { validateField } from './validate-field'

export const DateFormField = <Value>(validator: ValidatorConstructor<Value>) => {
  return z
    .date({ required_error: 'Este campo es obligatorio' })
    .superRefine((value, context) => validateField<Value>(value as Value, context, validator))
}
