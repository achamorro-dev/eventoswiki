import { LaptopBold, MoonBold, SunBold } from '@/ui/icons'
import type { FC } from 'react'
import { ThemeMode, useTheme } from './use-theme'

import { classnames } from '@/ui/classnames/classnames'
import styles from './theme-mode-toggle.module.css'

type ThemeModeToggleProps = {}

export const ThemeModeToggle: FC<ThemeModeToggleProps> = () => {
  const { isDarkSelected, isSystemSelected, toggleTheme, theme } = useTheme()

  if (!theme) return null

  return (
    <section className={styles['theme-toggle']}>
      <h3 className={styles.title}>Tema</h3>
      <div className={styles.buttons}>
        <button
          className={classnames(styles.button, { [styles.selected]: !isDarkSelected && !isSystemSelected })}
          onClick={() => toggleTheme(ThemeMode.light)}
        >
          <SunBold />
        </button>
        <button
          className={classnames(styles.button, { [styles.selected]: isDarkSelected })}
          onClick={() => toggleTheme(ThemeMode.dark)}
        >
          <MoonBold />
        </button>
        <button
          className={classnames(styles.button, { [styles.selected]: isSystemSelected })}
          onClick={() => toggleTheme(ThemeMode.system)}
        >
          <LaptopBold />
        </button>
      </div>
    </section>
  )
}
