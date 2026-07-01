import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'

import { BaseBottomSheet } from '@/components/base-bottom-sheet'
import { BaseBottomSheetRef } from '@/components/base-bottom-sheet.shared'

type ConfirmDeleteSheetProps = {
  ref: React.RefObject<BaseBottomSheetRef | null>
  title: string
  message: string
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmDeleteSheet({
  ref,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDeleteSheetProps) {
  const { t } = useTolgee(['language'])

  const handleConfirm = () => {
    ref.current?.close()
    setTimeout(() => {
      onConfirm()
    }, 300)
  }

  const handleCancel = () => {
    ref.current?.close()
    if (onCancel) {
      setTimeout(() => {
        onCancel()
      }, 300)
    }
  }

  return (
    <BaseBottomSheet ref={ref}>
      <View className="gap-4">
        <Text className="text-xl font-manrope-bold text-foreground">
          {title}
        </Text>
        <Text className="text-base font-manrope-regular text-muted-foreground">
          {message}
        </Text>

        <View className="gap-3 mt-4">
          <TouchableOpacity
            onPress={handleConfirm}
            className="bg-destructive py-4 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-base font-manrope-semibold text-white">{t('common.delete')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancel}
            className="bg-card py-4 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-base font-manrope-semibold text-foreground">
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseBottomSheet>
  )
}
