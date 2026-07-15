import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useValue } from '@legendapp/state/react'
import { useTolgee } from '@tolgee/react'
import { Stack, useRouter } from 'expo-router'

import { useGlobalStudySummary, useStudyDashboard } from '@/hooks/use-study'
import { addLocalDays, getStudySummary, localDateKey, startOfLocalDay } from '@/libs/study'
import { cardStore$ } from '@/state/card'
import { listStore$ } from '@/state/list'
import { studyStore$ } from '@/state/study'
import { cn } from '@/libs/cn'

export default function StudyProgressScreen() {
  const router = useRouter()
  const { t } = useTolgee(['language'])
  const summary = useGlobalStudySummary()
  const dashboard = useStudyDashboard()
  const lists = useValue(listStore$.lists)
  const cards = useValue(cardStore$.cards)
  const progressByCardId = useValue(studyStore$.progressByCardId)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addLocalDays(startOfLocalDay(), index - 6)
    const key = localDateKey(date)
    const reviewed = dashboard.stats
      .filter((item) => item.dateKey === key)
      .reduce((sum, item) => sum + item.reviewed, 0)
    return { key, reviewed, label: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2) }
  })
  const maxReviewed = Math.max(1, ...days.map((day) => day.reviewed))
  const thirtyDaysAgo = localDateKey(addLocalDays(startOfLocalDay(), -29))
  const reviewedLast30Days = dashboard.stats
    .filter((item) => item.dateKey >= thirtyDaysAgo)
    .reduce((sum, item) => sum + item.reviewed, 0)

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-5 gap-6"
    >
      <Stack.Screen options={{ title: t('progress.title') }} />

      <View className="flex-row flex-wrap gap-3">
        <Metric value={dashboard.streak.current} label={t('progress.currentStreak')} />
        <Metric value={dashboard.streak.best} label={t('progress.bestStreak')} />
        <Metric value={`${summary.accuracy}%`} label={t('progress.accuracy')} />
        <Metric value={dashboard.reviewedToday} label={t('progress.reviewedToday')} />
        <Metric value={reviewedLast30Days} label={t('progress.reviewedLast30Days')} />
      </View>

      <View className="gap-4 rounded-3xl bg-card p-5">
        <Text selectable className="text-base font-manrope-bold text-foreground">{t('progress.cards')}</Text>
        <View className="flex-row flex-wrap gap-3">
          <Status value={summary.new} label={t('progress.new')} tone="primary" />
          <Status value={summary.learning} label={t('progress.learning')} tone="danger" />
          <Status value={summary.review} label={t('progress.review')} tone="warning" />
          <Status value={summary.mastered} label={t('progress.mastered')} tone="success" />
        </View>
      </View>

      <View className="gap-4 rounded-3xl bg-card p-5">
        <Text selectable className="text-base font-manrope-bold text-foreground">{t('progress.lastSevenDays')}</Text>
        <View className="h-36 flex-row items-end gap-2">
          {days.map((day) => (
            <View key={day.key} className="flex-1 items-center gap-2">
              <Text selectable className="text-[10px] font-manrope-medium text-muted-foreground">{day.reviewed}</Text>
              <View className="h-24 w-full justify-end overflow-hidden rounded-md bg-background">
                <View className="w-full rounded-md bg-primary" style={{ height: `${Math.max(4, (day.reviewed / maxReviewed) * 100)}%` }} />
              </View>
              <Text selectable className="text-[10px] font-manrope-medium text-muted-foreground">{day.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-3">
        <Text selectable className="text-base font-manrope-bold text-foreground">{t('progress.byList')}</Text>
        {lists.map((list) => {
          const listCards = cards.filter((card) => card.listId === list.id)
          const listSummary = getStudySummary(listCards, progressByCardId)
          return (
            <View key={list.id} className="gap-3 rounded-2xl bg-card p-4">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text selectable className="font-manrope-semibold text-foreground">{list.name}</Text>
                  <Text selectable className="text-xs font-manrope-regular text-muted-foreground">
                    {t('progress.listSummary', { due: listSummary.due, mastered: listSummary.mastered, accuracy: listSummary.accuracy })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/study/setup', params: { id: list.id, mode: 'flashcards' } })}
                  className="rounded-xl bg-primary px-4 py-3"
                >
                  <Text className="text-xs font-manrope-semibold text-white">{t('progress.study')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <View className="min-w-[45%] flex-1 items-center gap-1 rounded-2xl bg-card p-4">
      <Text selectable className="text-2xl font-manrope-bold text-foreground" style={{ fontVariant: ['tabular-nums'] }}>{value}</Text>
      <Text selectable className="text-center text-xs font-manrope-regular text-muted-foreground">{label}</Text>
    </View>
  )
}

function Status({
  value,
  label,
  tone,
}: {
  value: number
  label: string
  tone: 'primary' | 'danger' | 'warning' | 'success'
}) {
  return (
    <View className="min-w-[45%] flex-1 flex-row items-center gap-3 rounded-xl bg-background p-3">
      <View
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          tone === 'primary' && 'bg-primary',
          tone === 'danger' && 'bg-red-500',
          tone === 'warning' && 'bg-amber-500',
          tone === 'success' && 'bg-green-500'
        )}
      />
      <View>
        <Text selectable className="font-manrope-bold text-foreground">{value}</Text>
        <Text selectable className="text-xs font-manrope-regular text-muted-foreground">{label}</Text>
      </View>
    </View>
  )
}
