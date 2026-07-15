import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'

import { BaseBottomSheet } from '@/components/base-bottom-sheet'
import { BaseBottomSheetRef } from '@/components/base-bottom-sheet.shared'
import { FileArrowDownIcon, PencilIcon, TrashIcon } from '@/icons'

type ListOptionsSheetProps = {
  ref: React.RefObject<BaseBottomSheetRef | null>
  onEdit: () => void
  onExport: () => void
  onDelete: () => void
}

export function ListOptionsSheet({ ref, onEdit, onExport, onDelete }: ListOptionsSheetProps) {
  const { t } = useTolgee(['language'])

  return (
    <BaseBottomSheet ref={ref}>
      <TouchableOpacity
        onPress={onEdit}
        className="flex-row items-center gap-3 py-4"
        activeOpacity={0.7}
      >
        <PencilIcon size={24} className="text-foreground" />
        <Text className="text-base font-manrope-medium text-foreground">
          {t('cardDetail.options.editList')}
        </Text>
      </TouchableOpacity>

      <View className="h-px bg-border my-2" />

      <TouchableOpacity
        onPress={onExport}
        className="flex-row items-center gap-3 py-4"
        activeOpacity={0.7}
      >
        <FileArrowDownIcon size={24} className="text-foreground" />
        <Text className="text-base font-manrope-medium text-foreground">
          {t('csvExport.action')}
        </Text>
      </TouchableOpacity>

      <View className="h-px bg-border my-2" />

      <TouchableOpacity
        onPress={onDelete}
        className="flex-row items-center gap-3 py-4"
        activeOpacity={0.7}
      >
        <TrashIcon size={24} className="text-destructive" />
        <Text className="text-base font-manrope-medium text-destructive">
          {t('cardDetail.options.deleteList')}
        </Text>
      </TouchableOpacity>
    </BaseBottomSheet>
  )
}
