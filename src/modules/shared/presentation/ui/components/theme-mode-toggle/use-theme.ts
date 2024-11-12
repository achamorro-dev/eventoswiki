import { useCallback, useEffect, useMemo, useState } from 'react'

const themeModeKey = 'theme-mode'
export enum ThemeMode {
  light = 'light',
  dark = 'dark',
  system = 'system',
}
export const useTheme = () => {
  const [theme, setTheme] = useState(ThemeMode.light)

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
    const setInitialThemeState = () => {
      const localStorageValue = localStorage?.getItem(themeModeKey)
      const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      if (localStorageValue) {
        setTheme(localStorageValue)
        return
      }

      if (preferDark) {
        setTheme(ThemeMode.dark)
        return
      }

      setTheme(ThemeMode.system)
    }

    setInitialThemeState()
  }, [])

  const removeDarkClass = () => {
    return document.documentElement.classList.remove(ThemeMode.dark)
  }

  const addDarkClass = () => {
    document.documentElement.classList.add(ThemeMode.dark)
  }

  const isDarkSelected = useMemo(() => {
    return theme === ThemeMode.dark
  }, [theme])

  const isSystemSelected = useMemo(() => {
    return theme === ThemeMode.system
  }, [theme])

  const onColorSchemeChange = useCallback(
    ({ matches }: MediaQueryListEvent): void => {
      if (theme !== ThemeMode.system) return

      if (matches) {
        addDarkClass()
        return
      }

      removeDarkClass()
    },
    [theme],
  )

  useEffect(() => {
    if (isSystemSelected) {
      window.matchMedia('(prefers-color-scheme: dark)').matches ? addDarkClass() : removeDarkClass()
      return
    }

    if (isDarkSelected) {
      addDarkClass()
      return
    }

    removeDarkClass()
  }, [theme])

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
    matchMedia.addEventListener('change', onColorSchemeChange)

    return () => matchMedia.removeEventListener('change', onColorSchemeChange)
  }, [onColorSchemeChange])

  useEffect(() => {
    localStorage.setItem(themeModeKey, theme)
  }, [theme])

  return {
    toggleTheme,
    theme,
    isDarkSelected,
    isSystemSelected,
  }
}
