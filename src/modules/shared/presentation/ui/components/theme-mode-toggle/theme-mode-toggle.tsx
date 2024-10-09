import type { FC } from 'react'
import { Laptop, Moon, Sun } from '@/ui/icons'
import { useTheme } from './use-theme'

type ThemeModeToggleProps = {}

export const ThemeModeToggle: FC<ThemeModeToggleProps> = () => {
  const { isDarkSelected, isSystemSelected, toggleTheme, theme } = useTheme()

  const onButtonClick = () => {
    toggleTheme()
  }

  if (!theme) return null

  return (
    <button
      className={`flex h-10  w-10 cursor-pointer items-center justify-center rounded-full bg-background text-xl hover:bg-background-light dark:bg-background-dark hover:dark:bg-background-dark-light`}
      tabIndex={0}
      aria-label="Cambiar tema de la web"
      onClick={onButtonClick}
    >
      {isDarkSelected ? <Moon /> : isSystemSelected ? <Laptop /> : <Sun />}
    </button>
  )
}
