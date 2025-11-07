import { useTheme } from '@react-navigation/native'
import { View } from 'react-native'

type ProgressProps = {
  /**
   * Progress value between 0 and 1
   */
  progress: number
}

export function Progress({ progress }: ProgressProps) {
  const { colors } = useTheme()
  return (
    <View className="w-full h-3 bg-card rounded-full overflow-hidden">
      <View
        style={{
          backgroundColor: colors.primary,
          height: 12,
          width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
        }}
      />
    </View>
  )
}
