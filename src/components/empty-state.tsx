import type { Icon } from 'phosphor-react-native'
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'

interface EmptyStateProps {
  icon: Icon
  title: string
  description: string
  buttonText?: string
  onButtonPress?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  onButtonPress,
}: EmptyStateProps) {
  const colorScheme = useColorScheme()
  const iconColor = colorScheme === 'dark' ? '#7C3AED' : '#6D28D9'

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="items-center gap-4 mb-8">
        <View className="w-24 h-24 rounded-full bg-primary/10 dark:bg-primary-dark/10 items-center justify-center mb-2">
          <Icon size={48} color={iconColor} />
        </View>
        <Text className="text-foreground dark:text-foreground-dark text-xl font-manrope-bold text-center">
          {title}
        </Text>
        <Text className="text-muted-foreground dark:text-muted-foreground text-sm font-manrope-regular text-center">
          {description}
        </Text>
      </View>
      {buttonText && onButtonPress && (
        <TouchableOpacity
          onPress={onButtonPress}
          className="bg-primary dark:bg-primary-dark px-8 py-3.5 rounded-xl"
        >
          <Text className="text-white text-base font-manrope-semibold">{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
