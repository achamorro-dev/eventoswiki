import type { FC, PropsWithChildren } from 'react'
import { classnames } from '../../../classnames/classnames'

type LinkProps = {
  href: string
  className?: string
  selected?: boolean
}

export const Link: FC<PropsWithChildren<LinkProps>> = props => {
  const { href, className = '', selected = false, children } = props
  return (
    <a
      href={href}
      className={classnames(
        'inline-block text-left font-medium md:text-center',
        { 'text-primary dark:text-primary-light': selected },
        className,
      )}
    >
      {children}
    </a>
  )
}
