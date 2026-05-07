import { useEffect, useMemo, useState } from 'react'

const themeModeKey = 'theme-mode'
export enum ThemeMode {
  light = 'light',
  dark = 'dark',
  system = 'system',
}

const applyThemeClass = (mode: string) => {
  const darkClass = ThemeMode.dark

  if (mode === ThemeMode.dark) {
    document.documentElement.classList.add(darkClass)
    return
  }

  if (mode === ThemeMode.system) {
    document.documentElement.classList.toggle(darkClass, window.matchMedia('(prefers-color-scheme: dark)').matches)
    return
  }

  document.documentElement.classList.remove(darkClass)
}

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(ThemeMode.light)

  const toggleTheme = (newTheme?: ThemeMode) => {
    if (newTheme) {
      setTheme(newTheme)
      return
    }

    if (theme === ThemeMode.system) {
      setTheme(ThemeMode.light)
      return
    }
    if (theme === ThemeMode.light) {
      setTheme(ThemeMode.dark)
      return
    }

    setTheme(ThemeMode.system)
    return
  }

  useEffect(() => {
    const localStorageValue = localStorage?.getItem(themeModeKey)

    if (localStorageValue) {
      setTheme(localStorageValue)
      return
    }

    setTheme(ThemeMode.light)
  }, [])

  useEffect(() => {
    if (!theme) return

    applyThemeClass(theme)
    localStorage.setItem(themeModeKey, theme)
  }, [theme])

  const isDarkSelected = useMemo(() => theme === ThemeMode.dark, [theme])
  const isSystemSelected = useMemo(() => theme === ThemeMode.system, [theme])

  return {
    toggleTheme,
    theme,
    isDarkSelected,
    isSystemSelected,
  }
}
