import { Text, TouchableOpacity, View } from 'react-native'

import { BrazilIcon, CaretRightIcon, SpainIcon, UnitedStatesIcon } from '@/icons'

type LanguageSelectorProps = {
  label: string
  value: string
  onPress: () => void
  disabled?: boolean
}

const LANGUAGE_INFO: Record<
  string,
  { label: string; Icon: React.ComponentType<{ width: number; height: number }> }
> = {
  'pt-BR': { label: 'Português', Icon: BrazilIcon },
  'en-US': { label: 'English', Icon: UnitedStatesIcon },
  'es-ES': { label: 'Español', Icon: SpainIcon },
}

export function LanguageSelector({
  label,
  value,
  onPress,
  disabled = false,
}: LanguageSelectorProps) {
  const languageInfo = LANGUAGE_INFO[value] || LANGUAGE_INFO['pt-BR']
  const Icon = languageInfo.Icon

  return (
    <View className="mb-6">
      <Text className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark mb-2.5">
        {label}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className="bg-card dark:bg-card-dark rounded-xl px-4 py-4 flex-row items-center justify-between active:opacity-70"
      >
        <View className="flex-row items-center gap-3 flex-1">
          <Icon width={20} height={15} />
          <Text className="text-sm font-manrope-semibold text-foreground dark:text-foreground-dark">
            {languageInfo.label}
          </Text>
        </View>
        <CaretRightIcon size={20} className="text-muted-foreground" />
      </TouchableOpacity>
    </View>
  )
}
