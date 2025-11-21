import { z } from 'astro/zod'
import type { ValidatorConstructor } from '@/shared/domain/validators/validator'
import { validateField } from './validate-field'

export const StringFormField = <Value>(
  validator?: ValidatorConstructor<Value>,
  options?: { requiredError?: string },
) => {
  const baseField = z.string({ required_error: options?.requiredError ?? 'Este campo es obligatorio' })
  if (validator) {
    return baseField.superRefine((value, context) => validateField<Value>(value as Value, context, validator))
  }

  return baseField
}
