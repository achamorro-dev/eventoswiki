import { FC, useState } from 'react'
import { Moon } from '../../atoms/icons/Moon'
import { Sun } from '../../atoms/icons/Sun'

type ThemeModeToggleProps = {
  className?: string
}

export const ThemeModeToggle: FC<ThemeModeToggleProps> = (props) => {
  const { className = '' } = props
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer hover:bg-gray-100 ${className}`}
      tabIndex={0}
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <Sun /> : <Moon />}
    </div>
  )
}
