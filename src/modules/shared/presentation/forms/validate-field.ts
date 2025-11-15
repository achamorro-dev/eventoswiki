import { z } from 'astro/zod'
import type { ValidatorConstructor } from '@/shared/domain/validators/validator'

export const validateField = <T>(val: T, ctx: z.RefinementCtx, ValidatorClass: ValidatorConstructor<T>) => {
  const validation = new ValidatorClass(val).validate()
  if (validation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: validation,
    })
  }
}
