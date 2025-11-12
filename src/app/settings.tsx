import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Switch } from '@/components/switch'
import { useIsSubscribed } from '@/hooks/use-is-subscribed'
import { BrazilIcon, CaretRightIcon, MimuIcon } from '@/icons'
import { useThemeStore } from '@/stores/theme'

const THEME_NAME_MAP = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
} as const

export default function SettingsScreen() {
  const router = useRouter()

  const { isLoading, isSubscribed } = useIsSubscribed()

  const theme = useThemeStore((state) => state.theme)

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)

  function goToLanguageSettings() {
    router.push('/language')
  }

  function goToColorSchemeSettings() {
    router.push('/theme')
  }

  function goToSubscription() {
    router.push('/subscription')
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingTop: 20 }}>
        {/* Banner PRO */}
        {!isLoading && !isSubscribed && (
          <TouchableOpacity
            className="mx-5 mb-6 flex-row items-center gap-4 px-6 py-4 bg-primary dark:bg-primary-dark rounded-xl"
            onPress={goToSubscription}
          >
            <Text className="text-sm font-manrope-bold leading-5 text-card flex-1">
              Aprenda mais rápido com o Mimu PRO
            </Text>
            <View className="flex-row justify-center items-center px-3 py-2 bg-primary-foreground dark:bg-primary-foreground-dark rounded-[20px]">
              <Text className="text-xs font-manrope-semibold leading-4 text-primary dark:text-primary-dark">
                Saiba mais
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Preferências */}
        <Text className="mx-5 mb-[18px] text-sm font-manrope-semibold leading-5 text-foreground dark:text-foreground-dark">
          Preferências
        </Text>

        {/* Notificações */}
        <View className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card dark:bg-card-dark rounded-xl">
          <Text className="text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
            Notificações
          </Text>
          <View className="w-10 h-6 bg-muted-foreground rounded-full">
            <Switch checked={isNotificationsEnabled} onChange={setIsNotificationsEnabled} />
          </View>
        </View>

        {/* Idioma */}
        <TouchableOpacity
          className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card dark:bg-card-dark rounded-xl"
          onPress={goToLanguageSettings}
        >
          <View className="flex-1 gap-2">
            <Text className="text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
              Idioma
            </Text>
            <View className="flex-row items-center gap-2">
              <BrazilIcon width={16} height={12} />
              <Text className="text-xs font-manrope-regular text-muted-foreground">Português</Text>
            </View>
          </View>
          <CaretRightIcon size={24} color="#FFFFFF" weight="regular" />
        </TouchableOpacity>

        {/* Esquema de cores */}
        <TouchableOpacity
          className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card dark:bg-card-dark rounded-xl"
          onPress={goToColorSchemeSettings}
        >
          <View className="flex-1 gap-2">
            <Text className="text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
              Esquema de cores
            </Text>
            <Text className="text-xs font-manrope-regular leading-4 text-muted-foreground">
              {THEME_NAME_MAP[theme]}
            </Text>
          </View>
          <CaretRightIcon size={24} color="#FFFFFF" weight="regular" />
        </TouchableOpacity>

        {/* Sobre o Mimu */}
        <Text className="mx-5 mb-[18px] mt-5 text-sm font-manrope-semibold leading-5 text-foreground dark:text-foreground-dark">
          Sobre o Mimu
        </Text>

        {/* Política de privacidade */}
        <TouchableOpacity className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card dark:bg-card-dark rounded-xl">
          <Text className="text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
            Política de privacidade
          </Text>
          <CaretRightIcon size={24} color="#FFFFFF" weight="regular" />
        </TouchableOpacity>

        {/* Avaliar app */}
        <TouchableOpacity className="mx-5 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card dark:bg-card-dark rounded-xl">
          <Text className="text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
            Avaliar app
          </Text>
          <CaretRightIcon size={24} color="#FFFFFF" weight="regular" />
        </TouchableOpacity>

        <View className="items-center justify-end gap-3 mb-5 flex-1">
          <MimuIcon className="text-foreground dark:text-foreground-dark" />
          <Text className="text-xs font-[Nunito] font-normal leading-4 uppercase text-muted-foreground">
            0.0.1 (1)
          </Text>
        </View>
      </SafeAreaView>
    </View>
  )
}
