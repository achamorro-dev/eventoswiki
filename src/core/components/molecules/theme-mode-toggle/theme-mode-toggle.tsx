import type { FC } from 'react'
import { Moon } from '../../atoms/icons/moon'
import { Sun } from '../../atoms/icons/sun'
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
      className={`flex h-10  w-10 cursor-pointer items-center justify-center rounded-full bg-background hover:bg-background-light dark:bg-background-dark hover:dark:bg-background-dark-light`}
      tabIndex={0}
      aria-label="Cambiar tema de la web"
      onClick={onButtonClick}
    >
      {isDarkSelected ? <Sun /> : <Moon />}
    </button>
  )
}
