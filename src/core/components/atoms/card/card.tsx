import type { FC, PropsWithChildren } from 'react'

type CardProps = {
  className?: string
}

export const Card: FC<PropsWithChildren<CardProps>> = (props) => {
  const { className = '', children } = props
  return (
    <div
      className={`flex flex-col items-start col-span-12 overflow-hidden shadow-sm rounded-xl border dark:border-white dark:border-opacity-10 md:col-span-6 lg:col-span-4 ${className} dark:bg-slate-600`}
    >
      {children}
    </div>
  )
}
