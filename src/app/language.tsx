import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { BrazilIcon, CheckIcon, UnitedStatesIcon } from '@/icons'

type Language = 'pt' | 'en'

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('pt')

  const languages = [
    { id: 'pt', label: 'Português', Icon: BrazilIcon },
    { id: 'en', label: 'Inglês', Icon: UnitedStatesIcon },
  ] as const

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <View className="flex-1 px-5 pt-4">
        <View className="gap-3">
          {languages.map(({ Icon, id, label }) => (
            <TouchableOpacity
              key={id}
              className="flex-row items-center gap-4 px-5 h-12 bg-card rounded-xl"
              onPress={() => setSelectedLanguage(id)}
            >
              <Icon width={16} height={12} />
              <Text className="flex-1 text-sm font-manrope-regular leading-5 text-foreground">
                {label}
              </Text>
              {selectedLanguage === id && <CheckIcon size={20} className="text-foreground" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}
