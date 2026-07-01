import { ReactNode, useImperativeHandle, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { BaseBottomSheetRef } from '@/components/base-bottom-sheet.shared'

type BaseBottomSheetProps = {
  ref: React.RefObject<BaseBottomSheetRef | null>
  children: ReactNode
  enablePanDownToClose?: boolean
}

export function BaseBottomSheet({
  ref,
  children,
}: BaseBottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    expand: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }))

  if (!isOpen) {
    return null
  }

  return (
    <View className="fixed inset-0 z-50 justify-end">
      <Pressable className="absolute inset-0 bg-black/50" onPress={() => setIsOpen(false)} />
      <View className="mx-auto w-full max-w-md rounded-t-3xl bg-card border-t border-border px-5 pt-3 pb-6 shadow-2xl">
        <View className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
        {children}
        <Pressable
          onPress={() => setIsOpen(false)}
          className="mt-4 self-end rounded-full bg-secondary px-4 py-2"
        >
          <Text className="text-sm font-manrope-semibold text-secondary-foreground">Fechar</Text>
        </Pressable>
      </View>
    </View>
  )
}
