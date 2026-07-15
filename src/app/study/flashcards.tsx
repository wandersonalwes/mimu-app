import { EmptyState } from '@/components/empty-state'
import { Progress } from '@/components/progress'
import { StudySuccess } from '@/components/study/study-success'
import { useCardsByListId } from '@/hooks/use-cards'
import { useSpeech } from '@/hooks/use-speech'
import { CardsIcon, HeartIcon, SpeakerHighIcon } from '@/icons'
import { cardActions } from '@/state/card'
import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FlashcardsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const cards = useCardsByListId(id)
  const { t } = useTolgee(['language'])

  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [learningCount, setLearningCount] = useState(0)
  const [understoodCount, setUnderstoodCount] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const { speak } = useSpeech()

  // Se não há cartões, mostrar mensagem
  if (!cards || cards.length === 0) {
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

  const card = cards[index]
  const toggleSide = () => setShowBack((s) => !s)

  const toggleFavorite = () => {
    cardActions.toggleFavorite(card.id)
  }

  const handleLearning = () => {
    setLearningCount((count) => count + 1)
    nextCard()
  }

  const handleUnderstood = () => {
    setUnderstoodCount((count) => count + 1)
    nextCard()
  }

  const nextCard = () => {
    setShowBack(false)
    const nextIndex = index + 1
    if (nextIndex >= cards.length) {
      setIsCompleted(true)
    } else {
      setIndex(nextIndex)
    }
  }

  const handleRestart = () => {
    setIndex(0)
    setShowBack(false)
    setLearningCount(0)
    setUnderstoodCount(0)
    setIsCompleted(false)
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleSpeak = () => {
    const textToSpeak = showBack ? card.back : card.front
    speak(textToSpeak)
  }

  // Tela de resumo
  if (isCompleted) {
    return (
      <>
        <Stack.Screen options={{ title: t('flashcards.title') }} />
        <StudySuccess
          title={t('studySuccess.title')}
          description={t('flashcards.summary.description')}
          metrics={[
            {
              label: t('flashcards.summary.learning'),
              value: learningCount,
              supportingText: learningCount === 1 ? t('common.term') : t('common.terms'),
              tone: 'danger',
            },
            {
              label: t('flashcards.summary.understood'),
              value: understoodCount,
              supportingText: understoodCount === 1 ? t('common.term') : t('common.terms'),
              tone: 'success',
            },
          ]}
          restartLabel={t('flashcards.summary.restart')}
          backLabel={t('common.back')}
          onRestart={handleRestart}
          onBack={handleGoBack}
        />
      </>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen options={{ title: `${index + 1} / ${cards.length}` }} />

        <View className="flex-1 p-5 gap-6 bg-background">
          {/* Barra de progresso fina, conforme Figma */}
          <Progress progress={(index + 1) / cards.length} />

          {/* Cartão principal com ícones no topo e termo central */}
          <View className="flex-1">
            <TouchableOpacity
              onPress={toggleSide}
              className="flex-1 w-full bg-card rounded-xl p-8 justify-center"
              activeOpacity={0.9}
            >
              {/* Ícones posicionados no topo do card */}
              <View className="absolute left-8 top-8">
                <TouchableOpacity onPress={handleSpeak}>
                  <SpeakerHighIcon
                    size={24}
                    className="text-foreground"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={toggleFavorite}
                className="absolute right-8 top-8"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <HeartIcon
                  size={24}
                  weight={card.isFavorite ? 'fill' : 'regular'}
                  className={
                    card.isFavorite ? 'text-red-500' : 'text-foreground'
                  }
                />
              </TouchableOpacity>

              <Text className="text-foreground text-xl font-manrope-semibold text-center">
                {showBack ? card.back : card.front}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botões inferiores lado a lado conforme Figma */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={handleLearning}
              className="flex-1 h-14 rounded-xl items-center justify-center bg-[#EF4444]"
            >
              <Text className="text-white text-base font-manrope-medium">
                {t('flashcards.learning')} ({learningCount})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUnderstood}
              className="flex-1 h-14 rounded-xl items-center justify-center bg-primary"
            >
              <Text className="text-white text-base font-manrope-medium">
                {t('flashcards.understood')} ({understoodCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
