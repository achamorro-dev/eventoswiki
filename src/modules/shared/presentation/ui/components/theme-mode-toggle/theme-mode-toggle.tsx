import type { FC } from 'react'
import { LaptopBold, MoonBold, SunBold } from '@/ui/icons'
import { cn } from '@/ui/lib/utils'
import { Button } from '../button'
import styles from './theme-mode-toggle.module.css'
import { ThemeMode, useTheme } from './use-theme'

type ThemeModeToggleProps = {}

export const ThemeModeToggle: FC<ThemeModeToggleProps> = () => {
  const { isDarkSelected, isSystemSelected, toggleTheme, theme } = useTheme()

  if (!theme) return null

  return (
    <section className={styles['theme-toggle']}>
      <h3 className={styles.title}>Tema</h3>
      <div className={styles.buttons}>
        <Button
          variant="ghost"
          size="icon"
          className={cn({ [styles.selected]: !isDarkSelected && !isSystemSelected })}
          onClick={() => toggleTheme(ThemeMode.light)}
        >
          <SunBold />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn({ [styles.selected]: isDarkSelected })}
          onClick={() => toggleTheme(ThemeMode.dark)}
        >
          <MoonBold />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn({ [styles.selected]: isSystemSelected })}
          onClick={() => toggleTheme(ThemeMode.system)}
        >
          <LaptopBold />
        </Button>
      </div>
    </section>
  )
}
