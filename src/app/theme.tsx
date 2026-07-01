import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTolgee } from '@tolgee/react'
import { Uniwind, useUniwind } from 'uniwind'

import { CheckIcon } from '@/icons'

export default function ThemeScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind()
  const { t } = useTolgee(['language'])
  const selectedTheme = hasAdaptiveThemes ? 'system' : theme

  const themes = [
    { id: 'light', label: t('theme.light') },
    { id: 'dark', label: t('theme.dark') },
    { id: 'system', label: t('theme.system') },
  ] as const

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <View className="flex-1 px-5 pt-4">
          <View className="gap-3">
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                className="flex-row items-center gap-4 px-5 h-12 bg-card rounded-xl"
                onPress={() => Uniwind.setTheme(theme.id)}
              >
                <Text className="flex-1 text-sm font-manrope-regular leading-5 text-foreground">
                  {theme.label}
                </Text>
                {selectedTheme === theme.id && (
                  <CheckIcon size={16} className="text-foreground" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
