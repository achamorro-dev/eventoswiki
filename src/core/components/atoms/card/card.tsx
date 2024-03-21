import type { FC, PropsWithChildren } from 'react'
import { classnames } from '../../../classnames/classnames'

type CardProps = {
  className?: string
}

export const Card: FC<PropsWithChildren<CardProps>> = props => {
  const { className = '', children } = props
  return (
    <div
      className={classnames(
        `col-span-12 flex flex-col items-start overflow-hidden rounded-xl border shadow-sm dark:border-white dark:border-opacity-10 dark:bg-slate-700 md:col-span-6 lg:col-span-4`,
        className,
      )}
    >
      {children}
    </div>
  )
}
