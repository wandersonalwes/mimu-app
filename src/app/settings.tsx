import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Switch } from '@/components/switch'
import { useIsSubscribed } from '@/hooks/use-is-subscribed'
import { BrazilIcon, CaretRightIcon, MimuIcon, SpainIcon, UnitedStatesIcon } from '@/icons'
import { useLanguageStore } from '@/stores/language'
import { useNotificationsStore } from '@/stores/notifications'
import { useThemeStore } from '@/stores/theme'

const THEME_NAME_MAP = {
  light: 'settings.theme.light',
  dark: 'settings.theme.dark',
  system: 'settings.theme.system',
} as const

const LANGUAGE_ICON_MAP = {
  'pt-BR': BrazilIcon,
  'en-US': UnitedStatesIcon,
  'es-ES': SpainIcon,
} as const

export default function SettingsScreen() {
  const router = useRouter()

  const { t } = useTolgee(['language'])

  const { isLoading, isSubscribed } = useIsSubscribed()

  const theme = useThemeStore((state) => state.theme)
  const language = useLanguageStore((state) => state.language)

  const isNotificationsEnabled = useNotificationsStore((state) => state.isEnabled)
  const setIsNotificationsEnabled = useNotificationsStore((state) => state.setIsEnabled)

  const LanguageIcon = LANGUAGE_ICON_MAP[language]

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
              {t('settings.proBanner.title')}
            </Text>
            <View className="flex-row justify-center items-center px-3 py-2 bg-primary-foreground dark:bg-primary-foreground-dark rounded-[20px]">
              <Text className="text-xs font-manrope-semibold leading-4 text-primary dark:text-primary-dark">
                {t('settings.proBanner.button')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Preferências */}
        <Text className="mx-5 mb-[18px] text-sm font-manrope-semibold leading-5 text-foreground dark:text-foreground-dark">
          {t('settings.preferences.title')}
        </Text>

        {/* Notificações */}
        <View className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card dark:bg-card-dark rounded-xl">
          <Text className="text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
            {t('settings.preferences.notifications')}
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
              {t('settings.preferences.language')}
            </Text>
            <View className="flex-row items-center gap-2">
              <LanguageIcon width={16} height={12} />
              <Text className="text-xs font-manrope-regular text-muted-foreground">
                {t(`settings.languageName.${language}`)}
              </Text>
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
              {t('settings.preferences.colorScheme')}
            </Text>
            <Text className="text-xs font-manrope-regular leading-4 text-muted-foreground">
              {t(THEME_NAME_MAP[theme])}
            </Text>
          </View>
          <CaretRightIcon size={24} color="#FFFFFF" weight="regular" />
        </TouchableOpacity>

        {/* Sobre o Mimu */}
        <Text className="mx-5 mb-[18px] mt-5 text-sm font-manrope-semibold leading-5 text-foreground dark:text-foreground-dark">
          {t('settings.about.title')}
        </Text>

        {/* Política de privacidade */}
        <TouchableOpacity className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card dark:bg-card-dark rounded-xl">
          <Text className="text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
            {t('settings.about.privacyPolicy')}
          </Text>
          <CaretRightIcon size={24} color="#FFFFFF" weight="regular" />
        </TouchableOpacity>

        {/* Avaliar app */}
        <TouchableOpacity className="mx-5 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card dark:bg-card-dark rounded-xl">
          <Text className="text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
            {t('settings.about.rateApp')}
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
