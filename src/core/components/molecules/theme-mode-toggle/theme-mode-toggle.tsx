import type { FC } from 'react'
import { Moon, Sun } from '../../../ui/icons'
import { useTheme } from './use-theme'

type ThemeModeToggleProps = {
  onClick?(): void
}

export const ThemeModeToggle: FC<ThemeModeToggleProps> = props => {
  const { onClick = () => {} } = props
  const { isDarkSelected, toggleTheme } = useTheme()

  const onButtonClick = () => {
    toggleTheme()
    onClick()
  }

  return (
    <button
      className={`flex h-10  w-10 cursor-pointer items-center justify-center rounded-full bg-background text-xl hover:bg-background-light dark:bg-background-dark hover:dark:bg-background-dark-light`}
      tabIndex={0}
      aria-label="Cambiar tema de la web"
      onClick={onButtonClick}
    >
      {isDarkSelected ? <Sun /> : <Moon />}
    </button>
  )
}
