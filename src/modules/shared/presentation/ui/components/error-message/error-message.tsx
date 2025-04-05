import { WarningCircle } from '@/ui/icons'
import { type FC } from 'react'

export const ErrorMessage: FC<{ message: string }> = ({ message }) => {
  return (
    <span className="bg-error-background text-destructive flex w-full items-center gap-2 rounded p-2 text-sm font-medium">
      <WarningCircle className="h-5 w-5" />
      {message}
    </span>
  )
}
