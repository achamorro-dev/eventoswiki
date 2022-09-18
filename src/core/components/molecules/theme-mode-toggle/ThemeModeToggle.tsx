import type { FC } from 'react'
import { Moon } from '../../atoms/icons/Moon'
import { Sun } from '../../atoms/icons/Sun'
import { useTheme } from './use-theme'

type ThemeModeToggleProps = {
  className?: string
}

export const ThemeModeToggle: FC<ThemeModeToggleProps> = (props) => {
  const { className = '' } = props
  const { isDarkSelected, toggleTheme } = useTheme()

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer hover:bg-gray-100 ${className}`}
      tabIndex={0}
      onClick={toggleTheme}
    >
      {isDarkSelected ? <Sun /> : <Moon />}
    </div>
  )
}
