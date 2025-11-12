import '@/styles/global.css'

import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { View } from 'react-native'
import 'react-native-reanimated'

export { ErrorBoundary } from 'expo-router'

import { Providers } from '@/components/providers'
import { useTolgee } from '@tolgee/react'

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

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}

function RootLayoutNav() {
  const { t } = useTolgee(['language'])
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackground: () => <View className="bg-background dark:bg-background-dark flex-1" />,
        headerBackTitle: ' ',
        headerTitleStyle: { fontFamily: 'ManropeSemiBold', fontSize: 16 },
      }}
    >
      <Stack.Screen name="index" options={{ header: () => null, title: '' }} />
      <Stack.Screen name="settings" options={{ title: t('common.settings') }} />
      <Stack.Screen name="language" options={{ title: t('common.language') }} />
      <Stack.Screen name="theme" options={{ title: t('common.theme') }} />
      <Stack.Screen name="subscription" options={{ title: t('common.subscription') }} />
      <Stack.Screen name="card/[id]" options={{ title: '' }} />
      <Stack.Screen name="card/create" options={{ title: t('common.createList') }} />
    </Stack>
  )
}
