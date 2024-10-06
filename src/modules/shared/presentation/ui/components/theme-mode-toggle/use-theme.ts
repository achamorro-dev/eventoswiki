import { useCallback, useEffect, useMemo, useState } from 'react'

const themeModeKey = 'theme-mode'
enum ThemeModes {
  light = 'light',
  dark = 'dark',
  system = 'system',
}
export const useTheme = () => {
  const [theme, setTheme] = useState('')

  const toggleTheme = () => {
    if (theme === ThemeModes.system) {
      setTheme(ThemeModes.light)
      return
    }
    if (theme === ThemeModes.light) {
      setTheme(ThemeModes.dark)
      return
    }

    setTheme(ThemeModes.system)
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
        setTheme(ThemeModes.dark)
        return
      }

      setTheme(ThemeModes.system)
    }

    setInitialThemeState()
  }, [])

  const removeDarkClass = () => {
    return document.documentElement.classList.remove(ThemeModes.dark)
  }

  const addDarkClass = () => {
    document.documentElement.classList.add(ThemeModes.dark)
  }

  const isDarkSelected = useMemo(() => {
    return theme === ThemeModes.dark
  }, [theme])

  const isSystemSelected = useMemo(() => {
    return theme === ThemeModes.system
  }, [theme])

  const onColorSchemeChange = useCallback(
    ({ matches }: MediaQueryListEvent): void => {
      if (theme !== ThemeModes.system) return

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
