import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTolgee } from '@tolgee/react'

import { BrazilIcon, CheckIcon, SpainIcon, UnitedStatesIcon } from '@/icons'
import { useLanguageStore } from '@/stores/language'

type Language = 'pt-BR' | 'en-US' | 'es-ES'

export default function LanguageScreen() {
  const tolgee = useTolgee(['language'])
  const { language, setLanguage } = useLanguageStore()

  const handleChangeLanguage = (lang: Language) => {
    setLanguage(lang)
    tolgee.changeLanguage(lang)
  }

  const languages = [
    { id: 'pt-BR', label: 'Português', Icon: BrazilIcon },
    { id: 'en-US', label: 'Inglês', Icon: UnitedStatesIcon },
    { id: 'es-ES', label: 'Espanhol', Icon: SpainIcon },
  ] as const

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <View className="flex-1 px-5 pt-4">
          <View className="gap-3">
            {languages.map(({ Icon, id, label }) => (
              <TouchableOpacity
                key={id}
                className="flex-row items-center gap-4 px-5 h-12 bg-card dark:bg-card-dark rounded-xl"
                onPress={() => handleChangeLanguage(id)}
              >
                <Icon width={16} height={12} />
                <Text className="flex-1 text-sm font-manrope-regular leading-5 text-foreground dark:text-foreground-dark">
                  {label}
                </Text>
                {language === id && (
                  <CheckIcon size={20} className="text-foreground dark:text-foreground-dark" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
