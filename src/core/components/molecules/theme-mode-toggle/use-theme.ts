import { useEffect, useMemo, useState } from 'react'

const themeModeKey = 'theme-mode'
const lightTheme = 'light'
const darkTheme = 'dark'
export const useTheme = () => {
  const [theme, setTheme] = useState('')

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme)
  }

  useEffect(() => {
    const localStorageValue = localStorage?.getItem(themeModeKey)
    const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (localStorageValue) {
      setTheme(localStorageValue)
    } else if (preferDark) {
      setTheme(darkTheme)
    } else {
      setTheme(lightTheme)
    }
  }, [])

  useEffect(() => {
    isDarkSelected
      ? document.documentElement.classList.add(darkTheme)
      : document.documentElement.classList.remove(darkTheme)

    if (!localStorage) return

    localStorage.setItem(themeModeKey, theme)
  }, [theme])

  const isDarkSelected = useMemo(() => {
    return theme === darkTheme
  }, [theme])

  return {
    toggleTheme,
    theme,
    isDarkSelected,
  }
}
