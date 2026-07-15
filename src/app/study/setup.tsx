import { useMemo, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

import { useCardsByListId } from '@/hooks/use-cards'
import { useList } from '@/hooks/use-lists'
import { useListStudySummary, useResumableSession } from '@/hooks/use-study'
import { cn } from '@/libs/cn'
import type { StudyMode } from '@/libs/study'
import { studyActions } from '@/state/study'

const SIZES = [10, 20, 30, 50] as const

export default function StudySetupScreen() {
  const router = useRouter()
  const { t } = useTolgee(['language'])
  const { id = '', mode = 'flashcards' } = useLocalSearchParams<{
    id: string
    mode: StudyMode
  }>()
  const [size, setSize] = useState<number>(20)
  const cards = useCardsByListId(id)
  const list = useList(id)
  const summary = useListStudySummary(id)
  const resumable = useResumableSession(id, mode)
  const route = `/study/${mode}` as const
  const canStudy = summary.due + summary.new > 0
  const distinctDefinitions = useMemo(
    () => new Set(cards.map((card) => card.back.trim().toLocaleLowerCase())).size,
    [cards]
  )
  const modeAvailable = mode !== 'questions' || distinctDefinitions >= 2

  function openSession(sessionId: string) {
    router.replace({ pathname: route, params: { id, sessionId } })
  }

  function start(practice: boolean) {
    const session = studyActions.createSession({ listId: id, mode, size, practice })
    if (session.cardIds.length) openSession(session.id)
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-5 gap-6"
    >
      <Stack.Screen options={{ title: t('studySetup.title') }} />

      <View className="gap-1">
        <Text selectable className="text-xl font-manrope-bold text-foreground">
          {list?.name}
        </Text>
        <Text selectable className="text-sm font-manrope-regular text-muted-foreground">
          {t(`cardDetail.studyModes.${mode}`)}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Metric value={summary.due} label={t('studySetup.due')} tone="danger" />
        <Metric value={summary.new} label={t('studySetup.new')} />
        <Metric value={summary.mastered} label={t('studySetup.mastered')} tone="success" />
      </View>

      <View className="gap-3">
        <Text selectable className="text-base font-manrope-semibold text-foreground">
          {t('studySetup.sessionSize')}
        </Text>
        <View className="flex-row gap-2">
          {SIZES.map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => setSize(value)}
              className={cn(
                'h-12 flex-1 items-center justify-center rounded-xl border',
                size === value ? 'border-primary bg-primary/10' : 'border-border bg-card'
              )}
            >
              <Text className="font-manrope-semibold text-foreground">{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!modeAvailable && (
        <View className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <Text selectable className="text-sm font-manrope-medium text-amber-700 dark:text-amber-300">
            {t('studySetup.questionsUnavailable')}
          </Text>
        </View>
      )}

      <View className="gap-3">
        {resumable && (
          <TouchableOpacity
            onPress={() => openSession(resumable.id)}
            className="h-14 items-center justify-center rounded-xl bg-primary"
          >
            <Text className="text-base font-manrope-semibold text-white">
              {t('studySetup.resume')} · {resumable.currentIndex}/{resumable.cardIds.length}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => start(false)}
          disabled={!canStudy || !modeAvailable}
          className={cn(
            'h-14 items-center justify-center rounded-xl',
            canStudy && modeAvailable ? 'bg-primary' : 'bg-muted opacity-50'
          )}
        >
          <Text className="text-base font-manrope-semibold text-white">
            {t('studySetup.start')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => start(true)}
          disabled={!cards.length || !modeAvailable}
          className="h-14 items-center justify-center rounded-xl border border-border bg-card disabled:opacity-50"
        >
          <Text className="text-base font-manrope-semibold text-foreground">
            {t('studySetup.practice')}
          </Text>
        </TouchableOpacity>
        <Text selectable className="text-center text-xs font-manrope-regular text-muted-foreground">
          {t('studySetup.practiceHint')}
        </Text>
      </View>
    </ScrollView>
  )
}

function Metric({
  value,
  label,
  tone = 'primary',
}: {
  value: number
  label: string
  tone?: 'primary' | 'danger' | 'success'
}) {
  return (
    <View
      className={cn(
        'flex-1 items-center gap-1 rounded-2xl border p-4',
        tone === 'danger' && 'border-red-500/20 bg-red-500/10',
        tone === 'success' && 'border-green-500/20 bg-green-500/10',
        tone === 'primary' && 'border-primary/20 bg-primary/10'
      )}
    >
      <Text selectable className="text-2xl font-manrope-bold text-foreground" style={{ fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
      <Text selectable className="text-center text-xs font-manrope-medium text-muted-foreground">
        {label}
      </Text>
    </View>
  )
}
