import type { FC, PropsWithChildren } from 'react'
import styles from './input-error.module.css'

export const InputError: FC<PropsWithChildren> = ({ children }) => {
  return <p className={styles.error}>{children}</p>
}
