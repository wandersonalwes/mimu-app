import { toastConfig } from '@/libs/toast'
import { useThemeStore } from '@/stores/theme'
import '@/styles/global.css'
import { themes } from '@/styles/theme'

import { ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { Appearance, useColorScheme, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

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
  const colorScheme = useColorScheme()
  const theme = useThemeStore((state) => state.theme)

  const isDarkMode = theme === 'dark' || (theme === 'system' && colorScheme === 'dark')

  useEffect(() => {
    Appearance.setColorScheme(isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <ThemeProvider value={isDarkMode ? themes.dark : themes.light}>
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerBackground: () => (
                <View className="bg-background dark:bg-background-dark flex-1" />
              ),
              headerBackTitle: ' ',
              headerTitleStyle: { fontFamily: 'ManropeSemiBold', fontSize: 16 },
            }}
          >
            <Stack.Screen name="index" options={{ header: () => null, title: '' }} />
            <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
            <Stack.Screen name="language" options={{ title: 'Mudar idioma' }} />
            <Stack.Screen name="theme" options={{ title: 'Mudar tema' }} />
            <Stack.Screen name="subscription" options={{ title: 'Assinatura' }} />
            <Stack.Screen name="card/[id]" options={{ title: '' }} />
            <Stack.Screen name="card/create" options={{ title: 'Criar uma lista' }} />
          </Stack>

          <Toast config={toastConfig} position="top" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
