import { z } from 'astro/zod'
import type { ValidatorConstructor } from '@/shared/domain/validators/validator'
import { validateField } from './validate-field'

export const NotRequiredStringFormField = <Value>(validator?: ValidatorConstructor<Value>) => {
  if (!validator) {
    return z.string().optional()
  }

  return z
    .string()
    .optional()
    .superRefine((value, context) => validateField<Value>(value as Value, context, validator))
}
