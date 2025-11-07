import '@/styles/global.css'
import { theme } from '@/styles/theme'

import { ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ManropeRegular: require('../../assets/fonts/Manrope-Regular.ttf'),
    ManropeMedium: require('../../assets/fonts/Manrope-Medium.ttf'),
    ManropeSemiBold: require('../../assets/fonts/Manrope-SemiBold.ttf'),
    ManropeBold: require('../../assets/fonts/Manrope-Bold.ttf'),
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={theme}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerBackground: () => null,
            headerBackTitle: ' ',
          }}
        >
          <Stack.Screen name="index" options={{ header: () => null, title: '' }} />
          <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
          <Stack.Screen name="language" options={{ title: 'Mudar idioma' }} />
          <Stack.Screen name="theme" options={{ title: 'Mudar tema' }} />
          <Stack.Screen name="subscription" options={{ title: 'Assinatura' }} />
          <Stack.Screen name="card/[id]" options={{ title: '' }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}
