import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { EmptyState } from '@/components/empty-state'
import { Progress } from '@/components/progress'
import { StudySuccess } from '@/components/study/study-success'
import { useCardsByListId } from '@/hooks/use-cards'
import { useCardProgress, useStudySession } from '@/hooks/use-study'
import { CardsIcon, HeartIcon, SpeakerHighIcon } from '@/icons'
import { cn } from '@/libs/cn'
import { getRatingInterval, type ReviewRating } from '@/libs/study'
import { cardActions } from '@/state/card'
import { studyActions } from '@/state/study'
import { useSpeech } from '@/hooks/use-speech'

const RATINGS: Array<{ rating: ReviewRating; className: string }> = [
  { rating: 'again', className: 'border-red-500/30 bg-red-500/15' },
  { rating: 'hard', className: 'border-amber-500/30 bg-amber-500/15' },
  { rating: 'good', className: 'border-primary/30 bg-primary/15' },
  { rating: 'easy', className: 'border-green-500/30 bg-green-500/15' },
]

export default function FlashcardsScreen() {
  const router = useRouter()
  const { id = '', sessionId = '' } = useLocalSearchParams<{ id: string; sessionId: string }>()
  const { t } = useTolgee(['language'])
  const cards = useCardsByListId(id)
  const session = useStudySession(sessionId)
  const [showBack, setShowBack] = useState(false)
  const { speak } = useSpeech()
  const sessionCards = session?.cardIds
    .map((cardId) => cards.find((card) => card.id === cardId))
    .filter((card) => card !== undefined) ?? []
  const card = sessionCards[session?.currentIndex ?? 0]
  const cardProgress = useCardProgress(card?.id)
  const completed = Boolean(session?.completedAt) || Boolean(session && session.currentIndex >= sessionCards.length)

  if (!session || (!card && !completed)) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          icon={CardsIcon}
          title={t('flashcards.emptyState.title')}
          description={t('flashcards.emptyState.description')}
          buttonText={t('common.back')}
          onButtonPress={() => router.back()}
        />
      </View>
    )
  }

  function answer(rating: ReviewRating) {
    if (!card || !session) return
    studyActions.recordAnswer(session.id, card.id, rating)
    studyActions.advanceSession(session.id)
    if (session.currentIndex + 1 >= sessionCards.length) studyActions.completeSession(session.id)
    setShowBack(false)
  }

  if (completed) {
    return (
      <>
        <Stack.Screen options={{ title: t('flashcards.title') }} />
        <StudySuccess
          title={t('studySuccess.title')}
          description={session.practice ? t('studySuccess.practiceDescription') : t('flashcards.summary.description')}
          highlight={{
            value: `${session.cardIds.length}`,
            label: t('studySuccess.reviewed'),
          }}
          metrics={[
            { label: t('studySuccess.correct'), value: session.correct, tone: 'success' },
            { label: t('studySuccess.incorrect'), value: session.incorrect, tone: 'danger' },
          ]}
          restartLabel={t('studySuccess.continue')}
          backLabel={t('common.back')}
          onRestart={() => router.replace({ pathname: '/study/setup', params: { id, mode: 'flashcards' } })}
          onBack={() => router.replace(`/card/${id}`)}
        />
      </>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen options={{ title: `${session.currentIndex + 1} / ${sessionCards.length}` }} />
        <View className="flex-1 gap-5 p-5">
          <Progress progress={(session.currentIndex + 1) / sessionCards.length} />
          {session.practice && (
            <Text selectable className="text-center text-xs font-manrope-medium text-muted-foreground">
              {t('studySetup.practiceBadge')}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => setShowBack((value) => !value)}
            className="flex-1 items-center justify-center rounded-3xl bg-card p-8"
            activeOpacity={0.9}
          >
            <TouchableOpacity
              onPress={() => speak(showBack ? card.back : card.front)}
              className="absolute left-8 top-8"
            >
              <SpeakerHighIcon size={24} className="text-foreground" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => cardActions.toggleFavorite(card.id)}
              className="absolute right-8 top-8"
            >
              <HeartIcon
                size={24}
                weight={card.isFavorite ? 'fill' : 'regular'}
                className={card.isFavorite ? 'text-red-500' : 'text-foreground'}
              />
            </TouchableOpacity>
            <Text selectable className="text-center text-xl font-manrope-semibold text-foreground">
              {showBack ? card.back : card.front}
            </Text>
            <Text selectable className="absolute bottom-6 text-xs font-manrope-regular text-muted-foreground">
              {t('flashcards.tapToFlip')}
            </Text>
          </TouchableOpacity>

          <View className="flex-row flex-wrap gap-3">
            {RATINGS.map(({ rating, className }) => {
              const interval = getRatingInterval(cardProgress, rating)
              return (
                <TouchableOpacity
                  key={rating}
                  onPress={() => answer(rating)}
                  className={cn('min-w-[45%] flex-1 items-center rounded-xl border px-3 py-3', className)}
                >
                  <Text className="text-sm font-manrope-semibold text-foreground">
                    {t(`reviewRating.${rating}`)}
                  </Text>
                  <Text className="text-xs font-manrope-regular text-muted-foreground">
                    {t('reviewRating.inDays', { days: interval })}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
