import '@/styles/global.css'

import { ThemeProvider } from '@react-navigation/native'
import { TolgeeProvider } from '@tolgee/react'
import { useEffect } from 'react'
import { Appearance, useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

export { ErrorBoundary } from 'expo-router'

import { useConfigurePurchases } from '@/hooks/use-configure-purchases'
import { toastConfig } from '@/libs/toast'
import { tolgee } from '@/libs/tolgee'
import { useLanguageStore } from '@/stores/language'
import { useThemeStore } from '@/stores/theme'
import { themes } from '@/styles/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme()
  const theme = useThemeStore((state) => state.theme)
  const language = useLanguageStore((state) => state.language)

  useConfigurePurchases()

  const isDarkMode = theme === 'dark' || (theme === 'system' && colorScheme === 'dark')

  useEffect(() => {
    Appearance.setColorScheme(isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    if (tolgee.getLanguage() !== language) {
      tolgee.changeLanguage(language)
    }
  }, [language])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <ThemeProvider value={isDarkMode ? themes.dark : themes.light}>
          <TolgeeProvider tolgee={tolgee}>{children}</TolgeeProvider>

          <Toast config={toastConfig} position="top" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
