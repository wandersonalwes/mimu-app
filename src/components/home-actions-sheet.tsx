import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'

import { BaseBottomSheet } from '@/components/base-bottom-sheet'
import { type BaseBottomSheetRef } from '@/components/base-bottom-sheet.shared'
import { FileArrowUpIcon, PlusIcon } from '@/icons'

type HomeActionsSheetProps = {
  ref: React.RefObject<BaseBottomSheetRef | null>
  onCreate: () => void
  onImport: () => void
}

export function HomeActionsSheet({ ref, onCreate, onImport }: HomeActionsSheetProps) {
  const { t } = useTolgee(['language'])

  return (
    <BaseBottomSheet ref={ref}>
      <TouchableOpacity
        onPress={onCreate}
        className="flex-row items-center gap-3 py-4 active:opacity-70"
      >
        <PlusIcon size={24} className="text-foreground" />
        <Text className="text-base font-manrope-medium text-foreground">
          {t('common.createList')}
        </Text>
      </TouchableOpacity>

      <View className="h-px bg-border my-2" />

      <TouchableOpacity
        onPress={onImport}
        className="flex-row items-center gap-3 py-4 active:opacity-70"
      >
        <FileArrowUpIcon size={24} className="text-foreground" />
        <Text className="text-base font-manrope-medium text-foreground">
          {t('csvImport.action')}
        </Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  )
}
