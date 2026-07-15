import { useMemo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { EmptyState } from '@/components/empty-state'
import { Progress } from '@/components/progress'
import { StudySuccess } from '@/components/study/study-success'
import { useCardsByListId } from '@/hooks/use-cards'
import { useStudySession } from '@/hooks/use-study'
import { SealQuestionIcon } from '@/icons'
import { cn } from '@/libs/cn'
import { studyActions } from '@/state/study'

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function QuestionsScreen() {
  const router = useRouter()
  const { t } = useTolgee(['language'])
  const { id = '', sessionId = '' } = useLocalSearchParams<{ id: string; sessionId: string }>()
  const cards = useCardsByListId(id)
  const session = useStudySession(sessionId)
  const [selected, setSelected] = useState<string | null>(null)
  const sessionCards = session?.cardIds
    .map((cardId) => cards.find((card) => card.id === cardId))
    .filter((card) => card !== undefined) ?? []
  const card = sessionCards[session?.currentIndex ?? 0]
  const optionsByCard = useMemo(() => {
    const pool = [...new Set([...sessionCards, ...cards.slice(0, 100)].map((item) => item.back))]
    return Object.fromEntries(
      sessionCards.map((item) => [
        item.id,
        shuffle([item.back, ...shuffle(pool.filter((value) => value !== item.back)).slice(0, 3)]),
      ])
    )
  }, [cards, session?.id])
  const completed = Boolean(session?.completedAt) || Boolean(session && session.currentIndex >= sessionCards.length)

  if (!session || (!card && !completed)) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          icon={SealQuestionIcon}
          title={t('questions.emptyState.title')}
          description={t('questions.emptyState.description')}
          buttonText={t('common.back')}
          onButtonPress={() => router.back()}
        />
      </View>
    )
  }

  function select(option: string) {
    if (!card || !session || selected) return
    setSelected(option)
    studyActions.recordAnswer(session.id, card.id, option === card.back ? 'good' : 'again')
  }

  function next() {
    if (!session) return
    studyActions.advanceSession(session.id)
    if (session.currentIndex + 1 >= sessionCards.length) studyActions.completeSession(session.id)
    setSelected(null)
  }

  if (completed) {
    const total = session.correct + session.incorrect
    const accuracy = total ? Math.round((session.correct / total) * 100) : 0
    return (
      <>
        <Stack.Screen options={{ title: t('questions.title') }} />
        <StudySuccess
          title={t('studySuccess.title')}
          description={session.practice ? t('studySuccess.practiceDescription') : t('questions.summary.description')}
          highlight={{ value: `${accuracy}%`, label: t('questions.summary.successRate') }}
          metrics={[
            { label: t('questions.summary.correct'), value: session.correct, tone: 'success' },
            { label: t('questions.summary.wrong'), value: session.incorrect, tone: 'danger' },
          ]}
          restartLabel={t('studySuccess.continue')}
          backLabel={t('common.back')}
          onRestart={() => router.replace({ pathname: '/study/setup', params: { id, mode: 'questions' } })}
          onBack={() => router.replace(`/card/${id}`)}
        />
      </>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen options={{ title: `${session.currentIndex + 1} / ${sessionCards.length}` }} />
        <View className="flex-1 p-5 gap-6">
          <Progress progress={(session.currentIndex + 1) / sessionCards.length} />
          <Text selectable className="text-xl font-manrope-bold text-foreground">{card.front}</Text>
          <Text selectable className="text-base font-manrope-regular text-foreground">
            {t('questions.instruction')}
          </Text>
          <View className="gap-3">
            {(optionsByCard[card.id] ?? []).map((option) => {
              const correct = selected !== null && option === card.back
              const wrong = selected === option && option !== card.back
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => select(option)}
                  className={cn(
                    'flex-row items-center rounded-xl px-5 py-4',
                    correct ? 'bg-green-500/15' : wrong ? 'bg-red-500/15' : 'bg-card'
                  )}
                >
                  <Text selectable className={cn(
                    'flex-1 text-sm font-manrope-regular',
                    correct ? 'text-green-600 dark:text-green-400' : wrong ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                  )}>
                    {option}
                  </Text>
                  {correct && <Text className="text-green-600">✓</Text>}
                  {wrong && <Text className="text-red-600">✗</Text>}
                </TouchableOpacity>
              )
            })}
          </View>
          {selected && (
            <TouchableOpacity onPress={next} className="mt-auto h-14 items-center justify-center rounded-xl bg-primary">
              <Text className="text-base font-manrope-semibold text-white">{t('common.next')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}
