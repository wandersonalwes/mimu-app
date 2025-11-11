import React, { ComponentRef, useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { PencilIcon, TrashIcon } from '@/icons'

type ListOptionsSheetProps = {
  ref: React.RefObject<ComponentRef<typeof BottomSheet> | null>
  onEdit: () => void
  onDelete: () => void
}

export function ListOptionsSheet({ ref, onEdit, onDelete }: ListOptionsSheetProps) {
  const { bottom } = useSafeAreaInsets()
  const { dark } = useTheme()

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  )

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['25%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: dark ? '#48484A' : '#C7C7CC',
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 20, paddingBottom: bottom + 20 }}>
        <TouchableOpacity
          onPress={onEdit}
          className="flex-row items-center gap-3 py-4"
          activeOpacity={0.7}
        >
          <PencilIcon size={24} className="text-foreground dark:text-foreground-dark" />
          <Text className="text-base font-manrope-medium text-foreground dark:text-foreground-dark">
            Editar Lista
          </Text>
        </TouchableOpacity>

        <View className="h-px bg-border dark:bg-border-dark my-2" />

        <TouchableOpacity
          onPress={onDelete}
          className="flex-row items-center gap-3 py-4"
          activeOpacity={0.7}
        >
          <TrashIcon size={24} className="text-destructive dark:text-destructive-dark" />
          <Text className="text-base font-manrope-medium text-destructive dark:text-destructive-dark">
            Excluir Lista
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  )
}
