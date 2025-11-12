import { useEffect } from 'react'
import { Appearance, useColorScheme } from 'react-native'

import { useThemeStore } from '@/stores/theme'

export function useConfigureTheme() {
  const colorScheme = useColorScheme()
  const theme = useThemeStore((state) => state.theme)

  const isDarkMode = theme === 'dark' || (theme === 'system' && colorScheme === 'dark')

  useEffect(() => {
    Appearance.setColorScheme(isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return { isDarkMode }
}
