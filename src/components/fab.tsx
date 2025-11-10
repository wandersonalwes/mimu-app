import { useTheme } from '@react-navigation/native'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function Fab({ className, ...props }: TouchableOpacityProps) {
  const { colors } = useTheme()
  const { bottom } = useSafeAreaInsets()
  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: bottom + 16, backgroundColor: colors.primary }]}
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
