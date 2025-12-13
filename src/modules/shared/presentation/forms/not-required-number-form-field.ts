import { z } from 'astro/zod'
import type { ValidatorConstructor } from '@/shared/domain/validators/validator'
import { validateField } from './validate-field'

export const NotRequiredNumberFormField = <Value>(validator?: ValidatorConstructor<Value>) => {
  if (!validator) {
    return z.number().optional()
  }

  return z
    .number()
    .optional()
    .superRefine((value, context) => validateField<Value>(value as Value, context, validator))
}
