import type { FC } from 'react'
import { LaptopBold, MoonBold, SunBold } from '@/ui/icons'
import { cn } from '@/ui/lib/utils'
import { Button } from '../button'
import styles from './theme-mode-toggle.module.css'
import { ThemeMode, useTheme } from './use-theme'

type ThemeModeToggleProps = {
  className?: string
}

export const ThemeModeToggle: FC<ThemeModeToggleProps> = ({ className }) => {
  const { isDarkSelected, isSystemSelected, toggleTheme, theme } = useTheme()

  if (!theme) return null

  const isLightSelected = !isDarkSelected && !isSystemSelected

  return (
    <section className={cn(styles['theme-toggle'], className)}>
      {/* <h3 className={styles.title}>Tema</h3> */}
      <div className={styles.buttons}>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Tema claro"
          aria-pressed={isLightSelected}
          className={cn({ [styles.selected]: isLightSelected })}
          onClick={() => toggleTheme(ThemeMode.light)}
        >
          <SunBold />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Tema oscuro"
          aria-pressed={isDarkSelected}
          className={cn({ [styles.selected]: isDarkSelected })}
          onClick={() => toggleTheme(ThemeMode.dark)}
        >
          <MoonBold />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Tema del sistema"
          aria-pressed={isSystemSelected}
          className={cn({ [styles.selected]: isSystemSelected })}
          onClick={() => toggleTheme(ThemeMode.system)}
        >
          <LaptopBold />
        </Button>
      </div>
    </section>
  )
}
