import { TolgeeProvider } from '@tolgee/react'
import { ThemeProvider } from 'expo-router/react-navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

export { ErrorBoundary } from 'expo-router'

import { useAnalyticsScreenTracking } from '@/hooks/use-analytics-screen-tracking'
import { useConfigureClarity } from '@/hooks/use-configure-clarity'
import { useConfigureOneSignal } from '@/hooks/use-configure-onesignal'
import { useConfigurePurchases } from '@/hooks/use-configure-purchases'
import { useConfigureTolgee } from '@/hooks/use-configure-tolgee'
import { toastConfig } from '@/libs/toast'
import { tolgee } from '@/libs/tolgee'
import { themes } from '@/styles/theme'
import { useUniwind } from 'uniwind'

export function Providers({ children }: { children: React.ReactNode }) {
  useConfigurePurchases()
  useConfigureOneSignal()
  useConfigureClarity()
  useConfigureTolgee()
  useAnalyticsScreenTracking()

  const { theme } = useUniwind()
  const isDarkMode = theme === 'dark'

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <ThemeProvider value={isDarkMode ? themes.dark : themes.light}>
        <TolgeeProvider tolgee={tolgee}>{children}</TolgeeProvider>
        <Toast config={toastConfig} position="top" />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
