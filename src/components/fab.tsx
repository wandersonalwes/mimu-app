import { useTheme } from '@react-navigation/native'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type FabProps = TouchableOpacityProps & {
  keyboardOffset?: number
}

export function Fab({ className, keyboardOffset = 0, style, ...props }: FabProps) {
  const { colors } = useTheme()
  const { bottom } = useSafeAreaInsets()
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { bottom: bottom + 20 + keyboardOffset, backgroundColor: colors.primary },
        style,
      ]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
