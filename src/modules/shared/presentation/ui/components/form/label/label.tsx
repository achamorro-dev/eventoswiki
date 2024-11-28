import { classnames } from '@/ui/classnames/classnames'
import type { FC, PropsWithChildren } from 'react'

import styles from './label.module.css'

interface Props {
  label: string
  className?: string
}

export const Label: FC<PropsWithChildren<Props>> = props => {
  const { label, className, children } = props

  return (
    <label className={classnames(styles.labelContainer, className)}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  )
}
