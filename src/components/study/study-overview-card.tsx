import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { useRouter } from 'expo-router'
import { useValue } from '@legendapp/state/react'

import { useGlobalStudySummary, useStudyDashboard } from '@/hooks/use-study'
import { TargetIcon } from '@/icons'
import { listStore$ } from '@/state/list'
import { cardStore$ } from '@/state/card'
import { studyStore$ } from '@/state/study'
import { getStudySummary } from '@/libs/study'

export function StudyOverviewCard() {
  const router = useRouter()
  const { t } = useTolgee(['language'])
  const summary = useGlobalStudySummary()
  const dashboard = useStudyDashboard()
  const lists = useValue(listStore$.lists)
  const cards = useValue(cardStore$.cards)
  const progress = useValue(studyStore$.progressByCardId)
  const targetList = lists
    .map((list) => ({
      list,
      summary: getStudySummary(cards.filter((card) => card.listId === list.id), progress),
    }))
    .sort((a, b) => (b.summary.due + b.summary.new) - (a.summary.due + a.summary.new))[0]

  return (
    <View className="mb-7 gap-4 rounded-3xl border border-primary/20 bg-primary/10 p-5">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
          <TargetIcon size={23} weight="fill" className="text-white" />
        </View>
        <View className="flex-1">
          <Text selectable className="text-base font-manrope-bold text-foreground">
            {t('progress.today')}
          </Text>
          <Text selectable className="text-xs font-manrope-regular text-muted-foreground">
            {t('progress.todaySummary', { due: summary.due, fresh: summary.new })}
          </Text>
        </View>
        <View className="items-center">
          <Text selectable className="text-xl font-manrope-bold text-foreground" style={{ fontVariant: ['tabular-nums'] }}>
            {dashboard.streak.current}
          </Text>
          <Text selectable className="text-[10px] font-manrope-medium text-muted-foreground">
            {t('progress.streak')}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-xl bg-background/70 p-3">
          <Text selectable className="text-lg font-manrope-bold text-foreground">{dashboard.reviewedToday}</Text>
          <Text selectable className="text-xs font-manrope-regular text-muted-foreground">{t('progress.reviewedToday')}</Text>
        </View>
        <View className="flex-1 rounded-xl bg-background/70 p-3">
          <Text selectable className="text-lg font-manrope-bold text-foreground">{summary.accuracy}%</Text>
          <Text selectable className="text-xs font-manrope-regular text-muted-foreground">{t('progress.accuracy')}</Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        {targetList && targetList.summary.due + targetList.summary.new > 0 && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/study/setup', params: { id: targetList.list.id, mode: 'flashcards' } })}
            className="h-12 flex-1 items-center justify-center rounded-xl bg-primary"
          >
            <Text className="text-sm font-manrope-semibold text-white">{t('progress.startStudy')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.push('/progress')}
          className="h-12 flex-1 items-center justify-center rounded-xl border border-primary/30 bg-card"
        >
          <Text className="text-sm font-manrope-semibold text-foreground">{t('progress.viewProgress')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
