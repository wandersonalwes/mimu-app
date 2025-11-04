import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { CaretRightIcon } from '@/icons'

type Props = {
  title: string
  subtitle?: string
  onPress?: () => void
}

export function CardListItem({ title, subtitle, onPress }: Props) {
  return (
    <TouchableOpacity
      className="bg-card rounded-2xl p-6 flex-row items-center justify-between"
      onPress={onPress}
    >
      <View className="gap-2">
        <Text className="text-foreground text-sm font-manrope-semibold">{title}</Text>
        {subtitle ? (
          <Text className="text-muted-foreground text-sm font-manrope-regular">{subtitle}</Text>
        ) : null}
      </View>

      <CaretRightIcon size={24} className="text-foreground" />
    </TouchableOpacity>
  )
}
