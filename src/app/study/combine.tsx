import { useMemo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { EmptyState } from '@/components/empty-state'
import { Progress } from '@/components/progress'
import { MatchItem } from '@/components/study/match-item'
import { StudySuccess } from '@/components/study/study-success'
import { useCardsByListId } from '@/hooks/use-cards'
import { useStudySession } from '@/hooks/use-study'
import { PuzzlePieceIcon } from '@/icons'
import { studyActions } from '@/state/study'

const ITEMS_PER_STEP = 4
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

export default function CombineScreen() {
  const router = useRouter()
  const { t } = useTolgee(['language'])
  const { id = '', sessionId = '' } = useLocalSearchParams<{ id: string; sessionId: string }>()
  const cards = useCardsByListId(id)
  const session = useStudySession(sessionId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sessionCards = session?.cardIds
    .map((cardId) => cards.find((card) => card.id === cardId))
    .filter((card) => card !== undefined) ?? []
  const currentCards = sessionCards.slice(
    session?.currentIndex ?? 0,
    (session?.currentIndex ?? 0) + ITEMS_PER_STEP
  )
  const orderKey = `${session?.id}:${Math.floor((session?.currentIndex ?? 0) / ITEMS_PER_STEP)}`
  const rightCards = useMemo(() => shuffle(currentCards), [orderKey])
  const matchedIds = new Set(
    currentCards.filter((card) => session?.ratings?.[card.id]).map((card) => card.id)
  )
  const stepComplete = currentCards.length > 0 && matchedIds.size === currentCards.length
  const completed = Boolean(session?.completedAt) || Boolean(session && session.currentIndex >= sessionCards.length)

  if (!session || (!currentCards.length && !completed)) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          icon={PuzzlePieceIcon}
          title={t('combine.emptyState.title')}
          description={t('combine.emptyState.description')}
          buttonText={t('common.back')}
          onButtonPress={() => router.back()}
        />
      </View>
    )
  }

  function selectRight(cardId: string) {
    if (!selectedId || !session) return
    if (selectedId === cardId) {
      studyActions.recordAnswer(
        session.id,
        cardId,
        session.failedCardIds?.includes(cardId) ? 'again' : 'good'
      )
    } else {
      studyActions.markFailedAttempt(session.id, selectedId)
    }
    setSelectedId(null)
  }

  function continueStep() {
    if (!session) return
    const count = currentCards.length
    studyActions.advanceSession(session.id, count)
    if (session.currentIndex + count >= sessionCards.length) studyActions.completeSession(session.id)
    setSelectedId(null)
  }

  if (completed) {
    return (
      <>
        <Stack.Screen options={{ title: t('combine.title') }} />
        <StudySuccess
          title={t('studySuccess.title')}
          description={session.practice ? t('studySuccess.practiceDescription') : t('combine.summary.description')}
          highlight={{ value: String(session.cardIds.length), label: t('combine.summary.matches') }}
          metrics={[
            { label: t('studySuccess.firstTry'), value: session.correct, tone: 'success' },
            { label: t('studySuccess.toReview'), value: session.incorrect, tone: 'danger' },
          ]}
          restartLabel={t('studySuccess.continue')}
          backLabel={t('common.back')}
          onRestart={() => router.replace({ pathname: '/study/setup', params: { id, mode: 'combine' } })}
          onBack={() => router.replace(`/card/${id}`)}
        />
      </>
    )
  }

  const completedCount = (session?.currentIndex ?? 0) + matchedIds.size
  const step = Math.floor((session?.currentIndex ?? 0) / ITEMS_PER_STEP) + 1
  const totalSteps = Math.ceil(sessionCards.length / ITEMS_PER_STEP)

  return (
    <View className="flex-1 bg-background p-5">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen options={{ title: `${t('combine.step')} ${step} / ${totalSteps}` }} />
        <View className="flex-1 gap-5">
          <Progress progress={completedCount / sessionCards.length} />
          <Text selectable className="text-base font-manrope-regular text-foreground">
            {t('combine.instruction')}
          </Text>
          <View className="flex-1 flex-row gap-3">
            <View className="flex-1 gap-3">
              {currentCards.map((card) => (
                <MatchItem
                  key={card.id}
                  label={card.front}
                  matched={matchedIds.has(card.id)}
                  selected={selectedId === card.id}
                  onPress={() => setSelectedId(selectedId === card.id ? null : card.id)}
                />
              ))}
            </View>
            <View className="flex-1 gap-3">
              {rightCards.map((card) => (
                <MatchItem
                  key={card.id}
                  label={card.back}
                  matched={matchedIds.has(card.id)}
                  onPress={() => selectRight(card.id)}
                />
              ))}
            </View>
          </View>
          {stepComplete ? (
            <TouchableOpacity onPress={continueStep} className="h-14 items-center justify-center rounded-xl bg-primary">
              <Text className="text-base font-manrope-semibold text-white">
                {session.currentIndex + currentCards.length >= sessionCards.length
                  ? t('common.finish')
                  : t('combine.nextStep')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text selectable className="text-center text-xs font-manrope-regular text-muted-foreground">
              {t('combine.selectInstruction')}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}
