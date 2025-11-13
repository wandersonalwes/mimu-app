import { ComponentRef } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'

import { BaseBottomSheet } from '@/components/base-bottom-sheet'
import { BrazilIcon, CheckIcon, SpainIcon, UnitedStatesIcon } from '@/icons'

type LanguageOption = {
  code: string
  label: string
  Icon: React.ComponentType<{ width: number; height: number }>
}

const LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', label: 'Português', Icon: BrazilIcon },
  { code: 'en-US', label: 'English', Icon: UnitedStatesIcon },
  { code: 'es-ES', label: 'Español', Icon: SpainIcon },
]

type LanguagePickerSheetProps = {
  ref: React.RefObject<ComponentRef<typeof BottomSheet> | null>
  selectedLanguage: string
  onSelectLanguage: (languageCode: string) => void
}

export function LanguagePickerSheet({
  ref,
  selectedLanguage,
  onSelectLanguage,
}: LanguagePickerSheetProps) {
  const handleSelect = (code: string) => {
    onSelectLanguage(code)
    ref.current?.close()
  }

  return (
    <BaseBottomSheet ref={ref}>
      {LANGUAGES.map((language) => (
        <TouchableOpacity
          key={language.code}
          onPress={() => handleSelect(language.code)}
          className="flex-row items-center gap-4 py-4"
          activeOpacity={0.7}
        >
          <language.Icon width={20} height={15} />
          <Text className="flex-1 text-base font-manrope-medium text-foreground dark:text-foreground-dark">
            {language.label}
          </Text>
          {selectedLanguage === language.code && (
            <CheckIcon size={24} className="text-primary dark:text-primary-dark" weight="bold" />
          )}
        </TouchableOpacity>
      ))}
    </BaseBottomSheet>
  )
}
