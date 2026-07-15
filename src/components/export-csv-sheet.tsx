import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'

import { BaseBottomSheet } from '@/components/base-bottom-sheet'
import { type BaseBottomSheetRef } from '@/components/base-bottom-sheet.shared'
import { type CsvDelimiter } from '@/libs/card-csv'

type ExportCsvSheetProps = {
  ref: React.RefObject<BaseBottomSheetRef | null>
  onSelect: (delimiter: CsvDelimiter) => void
}

export function ExportCsvSheet({ ref, onSelect }: ExportCsvSheetProps) {
  const { t } = useTolgee(['language'])

  function handleSelect(delimiter: CsvDelimiter) {
    ref.current?.close()
    onSelect(delimiter)
  }

  return (
    <BaseBottomSheet ref={ref}>
      <Text className="pb-3 text-base font-manrope-semibold text-foreground">
        {t('csvExport.chooseDelimiter')}
      </Text>

      <TouchableOpacity
        onPress={() => handleSelect(',')}
        className="flex-row items-center justify-between py-4 active:opacity-70"
      >
        <Text className="text-base font-manrope-medium text-foreground">
          {t('csvExport.comma')}
        </Text>
        <Text selectable className="text-base font-manrope-bold text-muted-foreground">,</Text>
      </TouchableOpacity>

      <View className="h-px bg-border my-2" />

      <TouchableOpacity
        onPress={() => handleSelect(';')}
        className="flex-row items-center justify-between py-4 active:opacity-70"
      >
        <Text className="text-base font-manrope-medium text-foreground">
          {t('csvExport.semicolon')}
        </Text>
        <Text selectable className="text-base font-manrope-bold text-muted-foreground">;</Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  )
}
