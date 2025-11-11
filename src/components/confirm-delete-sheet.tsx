import { ComponentRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'

import { BaseBottomSheet } from '@/components/base-bottom-sheet'

type ConfirmDeleteSheetProps = {
  ref: React.RefObject<ComponentRef<typeof BottomSheet> | null>
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
        <Text className="text-xl font-manrope-bold text-foreground dark:text-foreground-dark">
          {title}
        </Text>
        <Text className="text-base font-manrope-regular text-muted-foreground dark:text-muted-foreground">
          {message}
        </Text>

        <View className="gap-3 mt-4">
          <TouchableOpacity
            onPress={handleConfirm}
            className="bg-destructive dark:bg-destructive-dark py-4 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-base font-manrope-semibold text-white">Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancel}
            className="bg-card dark:bg-card-dark py-4 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-base font-manrope-semibold text-foreground dark:text-foreground-dark">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseBottomSheet>
  )
}
