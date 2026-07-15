import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ArrowLeftIcon, ArrowCounterClockwiseIcon, TrophyIcon } from '@/icons'
import { cn } from '@/libs/cn'

export type StudySuccessMetric = {
  label: string
  value: string | number
  supportingText?: string
  tone?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral'
}

type StudySuccessProps = {
  title: string
  description: string
  highlight?: {
    value: string
    label: string
  }
  metrics: StudySuccessMetric[]
  restartLabel: string
  backLabel: string
  onRestart: () => void
  onBack: () => void
}

const metricStyles = {
  primary: {
    container: 'border-primary/20 bg-primary/10',
    label: 'text-primary',
    value: 'text-primary',
  },
  success: {
    container: 'border-green-500/20 bg-green-500/10',
    label: 'text-green-600 dark:text-green-400',
    value: 'text-green-600 dark:text-green-400',
  },
  danger: {
    container: 'border-red-500/20 bg-red-500/10',
    label: 'text-red-600 dark:text-red-400',
    value: 'text-red-600 dark:text-red-400',
  },
  warning: {
    container: 'border-amber-500/20 bg-amber-500/10',
    label: 'text-amber-600 dark:text-amber-400',
    value: 'text-amber-600 dark:text-amber-400',
  },
  neutral: {
    container: 'border-border bg-background',
    label: 'text-muted-foreground',
    value: 'text-foreground',
  },
} as const

export function StudySuccess({
  title,
  description,
  highlight,
  metrics,
  restartLabel,
  backLabel,
  onRestart,
  onBack,
}: StudySuccessProps) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow justify-center p-5 py-8"
      >
        <View className="w-full max-w-xl self-center gap-5">
          <Animated.View
            entering={FadeInUp.duration(260)}
            className="items-center gap-5 rounded-3xl border border-border bg-card p-6"
            style={{ borderCurve: 'continuous' }}
          >
            <Animated.View
              entering={ZoomIn.delay(100).duration(220)}
              className="h-20 w-20 items-center justify-center rounded-full bg-primary/10"
            >
              <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
                <TrophyIcon size={30} weight="fill" className="text-white" />
              </View>
            </Animated.View>

            <View className="items-center gap-2">
              <Text
                selectable
                className="text-center text-2xl font-manrope-bold text-foreground"
              >
                {title}
              </Text>
              <Text
                selectable
                className="max-w-sm text-center text-sm leading-5 font-manrope-regular text-muted-foreground"
              >
                {description}
              </Text>
            </View>

            {highlight && (
              <View className="w-full items-center gap-1 rounded-2xl bg-background px-5 py-4">
                <Text
                  selectable
                  className="text-4xl font-manrope-bold text-foreground"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {highlight.value}
                </Text>
                <Text
                  selectable
                  className="text-xs font-manrope-medium text-muted-foreground"
                >
                  {highlight.label}
                </Text>
              </View>
            )}

            <View className="w-full flex-row flex-wrap gap-3">
              {metrics.map((metric, index) => {
                const styles = metricStyles[metric.tone ?? 'neutral']

                return (
                  <Animated.View
                    key={`${metric.label}-${index}`}
                    entering={FadeInUp.delay(120 + index * 60).duration(240)}
                    className={cn(
                      'min-w-24 flex-1 items-center gap-1 rounded-2xl border px-3 py-4',
                      styles.container
                    )}
                    style={{ borderCurve: 'continuous' }}
                  >
                    <Text
                      selectable
                      className={cn('text-2xl font-manrope-bold', styles.value)}
                      style={{ fontVariant: ['tabular-nums'] }}
                    >
                      {metric.value}
                    </Text>
                    <Text
                      selectable
                      className={cn('text-center text-xs font-manrope-semibold', styles.label)}
                    >
                      {metric.label}
                    </Text>
                    {metric.supportingText && (
                      <Text
                        selectable
                        className="text-center text-xs font-manrope-regular text-muted-foreground"
                      >
                        {metric.supportingText}
                      </Text>
                    )}
                  </Animated.View>
                )
              })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(220).duration(260)} className="gap-3">
            <TouchableOpacity
              onPress={onRestart}
              className="h-14 flex-row items-center justify-center gap-2 rounded-xl bg-primary px-5 active:opacity-80"
            >
              <ArrowCounterClockwiseIcon size={20} className="text-white" />
              <Text className="text-base font-manrope-semibold text-white">{restartLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onBack}
              className="h-14 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 active:opacity-70"
            >
              <ArrowLeftIcon size={20} className="text-foreground" />
              <Text className="text-base font-manrope-semibold text-foreground">{backLabel}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
