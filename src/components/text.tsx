import { cn } from '@/libs/cn'
import { Text as NativeText, TextProps } from 'react-native'

export function Text({ className, ...props }: TextProps) {
  return (
    <NativeText
      className={cn('text-foreground dark:text-foreground-dark font-manrope-regular', className)}
      {...props}
    />
  )
}
