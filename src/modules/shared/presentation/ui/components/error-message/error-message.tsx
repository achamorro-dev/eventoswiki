import { WarningCircle } from '@/ui/icons'
import { type FC } from 'react'

export const ErrorMessage: FC<{ message: string }> = ({ message }) => {
  return (
    <span className="flex w-full items-center gap-2 rounded bg-error-background p-2 text-sm font-medium text-error">
      <WarningCircle className="h-5 w-5" />
      {message}
    </span>
  )
}
