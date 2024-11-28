import type { FC, PropsWithChildren } from 'react'
import { InputError } from '../input-error/input-error'
import { Label } from '../label/label'
import './base-input.css'

interface Props {
  label?: string
  className?: string
  error?: string
}

export const BaseInput: FC<PropsWithChildren<Props>> = ({ label, className, error, children }) => {
  if (!label) {
    return (
      <>
        {children}
        {error && <InputError>{error}</InputError>}
      </>
    )
  }

  return (
    <Label label={label} className={className}>
      {children}
      {error && <InputError>{error}</InputError>}
    </Label>
  )
}
