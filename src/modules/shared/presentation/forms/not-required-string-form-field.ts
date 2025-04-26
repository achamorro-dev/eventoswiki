import type { ValidatorConstructor } from '@/shared/domain/validators/validator'
import { z } from 'astro/zod'
import { validateField } from './validate-field'

export const NotRequiredStringFormField = <Value>(validator: ValidatorConstructor<Value>) => {
  return z
    .string()
    .optional()
    .superRefine((value, context) => validateField<Value>(value as Value, context, validator))
}
