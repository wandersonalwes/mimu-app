import { cn } from '@/libs/cn'
import React from 'react'
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native'

export type MatchItemProps = {
  label: string
  matched?: boolean
  selected?: boolean
  disabled?: boolean
  onPress?: (event: GestureResponderEvent) => void
}

export function MatchItem({
  label,
  matched = false,
  selected = false,
  disabled,
  onPress,
}: MatchItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled ?? matched}
      className={cn(
        'px-4 py-4 rounded-2xl bg-card dark:bg-card-dark border h-20 justify-center items-center',
        matched && 'border-green-600 opacity-60',
        !matched && selected && 'border-primary dark:border-primary-dark',
        !matched && !selected && 'border-transparent'
      )}
    >
      <Text className="text-sm text-foreground dark:text-foreground-dark font-manrope-medium">
        {label}
      </Text>
    </TouchableOpacity>
  )
}
