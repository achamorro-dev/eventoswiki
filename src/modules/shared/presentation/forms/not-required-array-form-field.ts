import type { ValidatorConstructor } from '@/shared/domain/validators/validator'
import { z, type ZodTypeAny } from 'astro/zod'
import { validateField } from './validate-field'

export const NotRequiredArrayFormField = <Value>(type: ZodTypeAny, validator?: ValidatorConstructor<Value>) => {
  if (!validator) {
    return z.array(type).optional()
  }

  return z
    .array(type)
    .optional()
    .superRefine((value, context) => validateField<Value>(value as Value, context, validator))
}
