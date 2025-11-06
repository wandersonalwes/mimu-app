import { cn } from '@/libs/cn'
import { Pressable, View } from 'react-native'

type SwitchProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export function Switch({ checked, onChange }: SwitchProps) {
  return (
    <Pressable
      className={cn('w-10 h-6 rounded-full bg-gray-400 relative', {
        'bg-primary': checked,
      })}
      onPress={() => onChange?.(!checked)}
    >
      <View
        className={cn('w-4 h-4 bg-white rounded-full absolute left-1 top-1/2 -translate-y-1/2', {
          'right-1 left-auto': checked,
        })}
      />
    </Pressable>
  )
}
