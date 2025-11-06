import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CheckIcon } from '@/icons'

type Theme = 'light' | 'dark' | 'system'

export default function ThemeScreen() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light')

  const themes = [
    { id: 'light', label: 'Claro' },
    { id: 'dark', label: 'Escuro' },
    { id: 'system', label: 'Padrão do sistema' },
  ] as const

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <View className="flex-1 px-5 pt-4">
        <View className="gap-3">
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              className="flex-row items-center gap-4 px-5 h-12 bg-card rounded-xl"
              onPress={() => setSelectedTheme(theme.id)}
            >
              <Text className="flex-1 text-sm font-manrope-regular leading-5 text-foreground">
                {theme.label}
              </Text>
              {selectedTheme === theme.id && <CheckIcon size={16} className="text-foreground" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}
