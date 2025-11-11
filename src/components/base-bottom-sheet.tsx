import { ComponentRef, ReactNode, useCallback } from 'react'

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type BaseBottomSheetProps = {
  ref: React.RefObject<ComponentRef<typeof BottomSheet> | null>
  children: ReactNode
  enablePanDownToClose?: boolean
}

export function BaseBottomSheet({
  ref,
  children,
  enablePanDownToClose = true,
}: BaseBottomSheetProps) {
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
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: dark ? '#48484A' : '#C7C7CC',
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 20, paddingBottom: bottom + 20 }}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  )
}
