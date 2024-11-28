import { classnames } from '@/ui/classnames/classnames'
import type { FC, PropsWithChildren } from 'react'
import { BaseInput } from '../base-input/base-input'
import type { ReactInput } from '../types/react-input'

interface Props extends ReactInput {
  className?: string
}

export const InputText: FC<PropsWithChildren<Props>> = props => {
  const { label, className, variant = 'default', error, ...rest } = props

  return (
    <BaseInput label={label} error={error}>
      <input
        className={classnames('input', `input-${variant}`, { 'input-with-error': error !== undefined }, className)}
        {...rest}
      />
    </BaseInput>
  )
}
