import type { ValidatorConstructor } from '@/shared/domain/validators/validator'
import { z } from 'astro/zod'
import { validateField } from './validate-field'

export const StringFormField = <Value>(validator: ValidatorConstructor<Value>) => {
  return z.string().superRefine((value, context) => validateField<Value>(value as Value, context, validator))
}
