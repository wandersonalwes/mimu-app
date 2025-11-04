import { cn } from '@/libs/cn'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

export function Fab({ className, ...props }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      className={cn(
        'size-16 rounded-full bg-primary justify-center items-center absolute bottom-8 right-5',
        className
      )}
      {...props}
    />
  )
}
