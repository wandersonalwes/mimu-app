import { useTheme } from "expo-router/react-navigation"
import type { Icon } from 'phosphor-react-native'
import { Text, TouchableOpacity, View } from 'react-native'

interface EmptyStateProps {
  icon: Icon
  title: string
  description: string
  buttonText?: string
  onButtonPress?: () => void
  secondaryButtonText?: string
  onSecondaryButtonPress?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  onButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
}: EmptyStateProps) {
  const { colors } = useTheme()

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="items-center gap-4 mb-8">
        <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-2">
          <Icon size={48} color={colors.primary.toString()} />
        </View>
        <Text className="text-foreground text-xl font-manrope-bold text-center">
          {title}
        </Text>
        <Text className="text-muted-foreground text-sm font-manrope-regular text-center">
          {description}
        </Text>
      </View>
      <View className="items-center gap-3">
        {buttonText && onButtonPress && (
          <TouchableOpacity
            onPress={onButtonPress}
            className="bg-primary px-8 py-3.5 rounded-xl"
          >
            <Text className="text-white text-base font-manrope-semibold">{buttonText}</Text>
          </TouchableOpacity>
        )}
        {secondaryButtonText && onSecondaryButtonPress && (
          <TouchableOpacity
            onPress={onSecondaryButtonPress}
            className="px-8 py-3 active:opacity-70"
          >
            <Text className="text-primary text-base font-manrope-semibold">
              {secondaryButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
