import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CheckIcon } from '@/icons'
import { useThemeStore } from '@/stores/theme'

export default function ThemeScreen() {
  const { theme: selectedTheme, setTheme } = useThemeStore()

  const themes = [
    { id: 'light', label: 'Claro' },
    { id: 'dark', label: 'Escuro' },
    { id: 'system', label: 'Padrão do sistema' },
  ] as const

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <View className="flex-1 px-5 pt-4">
          <View className="gap-3">
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                className="flex-row items-center gap-4 px-5 h-12 bg-card dark:bg-card-dark rounded-xl"
                onPress={() => setTheme(theme.id)}
              >
                <Text className="flex-1 text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
                  {theme.label}
                </Text>
                {selectedTheme === theme.id && (
                  <CheckIcon size={16} className="text-foreground dark:text-foreground-dark" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
