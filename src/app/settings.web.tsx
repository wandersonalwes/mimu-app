import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { BrazilIcon, CaretRightIcon, MimuIcon, SpainIcon, UnitedStatesIcon } from '@/icons'
import { useLanguageStore } from '@/stores/language'
import { useUniwind } from 'uniwind'

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
  const { theme, hasAdaptiveThemes } = useUniwind()
  const language = useLanguageStore((state) => state.language)
  const selectedTheme = hasAdaptiveThemes ? 'system' : theme
  const LanguageIcon = LANGUAGE_ICON_MAP[language]

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingTop: 20 }}>
        <View className="flex-1 w-full max-w-2xl self-center">
          <Text className="mx-5 mb-[18px] text-sm font-manrope-semibold leading-5 text-foreground">
            {t('settings.preferences.title')}
          </Text>

          <TouchableOpacity
            className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card rounded-xl"
            onPress={() => router.push('/language')}
          >
            <View className="flex-1 gap-2">
              <Text className="text-sm font-manrope-regular leading-5 text-foreground">
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

          <TouchableOpacity
            className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card rounded-xl"
            onPress={() => router.push('/theme')}
          >
            <View className="flex-1 gap-2">
              <Text className="text-sm font-manrope-regular leading-5 text-foreground">
                {t('settings.preferences.colorScheme')}
              </Text>
              <Text className="text-xs font-manrope-regular leading-4 text-muted-foreground">
                {t(THEME_NAME_MAP[selectedTheme])}
              </Text>
            </View>
            <CaretRightIcon size={24} color="#FFFFFF" weight="regular" />
          </TouchableOpacity>

          <Text className="mx-5 mb-[18px] mt-5 text-sm font-manrope-semibold leading-5 text-foreground">
            {t('settings.about.title')}
          </Text>

          <TouchableOpacity className="mx-5 mb-4 flex-row justify-between items-center gap-4 px-5 py-3.5 bg-card rounded-xl">
            <Text className="text-sm font-manrope-regular leading-5 text-foreground">
              {t('settings.about.privacyPolicy')}
            </Text>
            <CaretRightIcon size={24} color="#FFFFFF" weight="regular" />
          </TouchableOpacity>

          <View className="items-center justify-end gap-3 mb-5 flex-1">
            <MimuIcon className="text-foreground" />
            <Text className="text-xs font-[Nunito] font-normal leading-4 uppercase text-muted-foreground">
              Web
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
