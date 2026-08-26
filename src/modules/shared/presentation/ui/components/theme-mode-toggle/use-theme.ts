import { useEffect, useMemo, useState } from 'react'

const themeModeKey = 'theme-mode'
export enum ThemeMode {
  light = 'light',
  dark = 'dark',
  system = 'system',
}

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === ThemeMode.light || value === ThemeMode.dark || value === ThemeMode.system

const readStoredTheme = (): ThemeMode => {
  const storedValue = localStorage.getItem(themeModeKey)

  return isThemeMode(storedValue) ? storedValue : ThemeMode.system
}

const applyThemeClass = (mode: ThemeMode) => {
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

const getNextTheme = (currentTheme: ThemeMode): ThemeMode => {
  if (currentTheme === ThemeMode.system) return ThemeMode.light
  if (currentTheme === ThemeMode.light) return ThemeMode.dark

  return ThemeMode.system
}

export const useTheme = () => {
  // El tema ya lo aplica el script inline de base-head.astro antes del primer pintado.
  // Aquí solo se sincroniza el estado al montar (sin tocar el DOM ni localStorage) para
  // evitar un repintado del tema claro cada vez que se monta el toggle.
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.system)

  useEffect(() => {
    setTheme(readStoredTheme())
  }, [])

  const toggleTheme = (newTheme?: ThemeMode) => {
    const nextTheme = newTheme ?? getNextTheme(theme)

    setTheme(nextTheme)
    applyThemeClass(nextTheme)
    localStorage.setItem(themeModeKey, nextTheme)
  }

  const isDarkSelected = useMemo(() => theme === ThemeMode.dark, [theme])
  const isSystemSelected = useMemo(() => theme === ThemeMode.system, [theme])

  return {
    toggleTheme,
    theme,
    isDarkSelected,
    isSystemSelected,
  }
}
