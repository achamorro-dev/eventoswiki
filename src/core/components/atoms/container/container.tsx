import type { FC, PropsWithChildren } from 'react'
import { classnames } from '../../../classnames/classnames'

type ContainerProps = {
  maxSize?: 's' | 'm' | 'l'
  className?: string
}

const CONTAINER_MAX_SIZES: { [key: string]: string } = {
  s: 'max-w-3xl',
  m: 'max-w-5xl',
  l: 'max-w-7xl',
}

export const Container: FC<PropsWithChildren<ContainerProps>> = ({ maxSize = 'l', children, className }) => {
  const maxSizeClass = CONTAINER_MAX_SIZES[maxSize]

  return (
    <div className="w-full px-6 pb-12 antialiased bg-white dark:bg-slate-900">
      <div className={classnames('mx-auto', maxSizeClass, className)}>{children}</div>
    </div>
  )
}
