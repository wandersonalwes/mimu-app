import { EmptyState } from '@/components/empty-state'
import { Progress } from '@/components/progress'
import { useCardsByListId } from '@/hooks/use-cards'
import { SealQuestionIcon } from '@/icons'
import { useTolgee } from '@tolgee/react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface QA {
  front: string
  back: string
  options: string[]
}

export default function QuestionsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const cards = useCardsByListId(id!)
  const { t } = useTolgee(['language'])

  // Gerar perguntas baseadas nos cartões reais
  // Usar useState ao invés de useMemo para não recalcular quando cards mudar
  const [questions] = useState<QA[]>(() => {
    if (!cards || cards.length === 0) return []

    return cards.map((card, i) => {
      // Pegar 3 opções incorretas aleatórias
      const distractors = cards
        .filter((_, di) => di !== i)
        .slice(0, 3)
        .map((d) => d.back)

      // Embaralhar as opções
      const shuffled = [...distractors, card.back].sort(() => Math.random() - 0.5)

      return {
        front: card.front,
        back: card.back,
        options: shuffled,
      }
    })
  })

  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  // Se não há cartões, mostrar mensagem
  if (!cards || cards.length === 0) {
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

  const q = questions[qIndex]
  const answered = selected !== null

  const select = (opt: string) => {
    if (answered) return
    setSelected(opt)
    if (opt === q.back) setCorrectCount((c) => c + 1)
  }

  const next = () => {
    setSelected(null)
    setQIndex((i) => i + 1)
  }

  const handleRestart = () => {
    setQIndex(0)
    setSelected(null)
    setCorrectCount(0)
  }

  const handleGoBack = () => {
    router.back()
  }

  const finished = qIndex >= questions.length
  const wrongCount = finished ? questions.length - correctCount : 0
  const successRate = finished ? Math.round((correctCount / questions.length) * 100) : 0

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack.Screen
          options={{ title: finished ? t('questions.title') : `${qIndex + 1}/${questions.length}` }}
        />

        <View className="flex-1">
          {finished ? (
            <View className="flex-1 px-5 gap-6 justify-center">
              <View className="bg-card rounded-xl p-8 gap-6">
                <View className="items-center gap-2">
                  <Text className="text-6xl">
                    {successRate >= 80 ? '🎉' : successRate >= 50 ? '👍' : '💪'}
                  </Text>
                  <Text className="text-foreground text-2xl font-manrope-bold text-center">
                    {successRate >= 80
                      ? t('flashcards.summary.title')
                      : successRate >= 50
                      ? t('flashcards.summary.title')
                      : t('flashcards.summary.title')}
                  </Text>
                  <Text className="text-foreground dark:text-foreground/60 text-base font-manrope-regular text-center">
                    {t('questions.summary.description') || 'Você completou todas as perguntas'}
                  </Text>
                </View>

                <View className="bg-background rounded-xl p-4">
                  <View className="flex-row items-center justify-center gap-2 mb-4">
                    <Text className="text-foreground text-4xl font-manrope-bold">
                      {successRate}%
                    </Text>
                  </View>

                  <View className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View className="w-3 h-3 rounded-full bg-green-500" />
                        <Text className="text-foreground text-sm font-manrope-regular">
                          {t('questions.summary.correct')}
                        </Text>
                      </View>
                      <Text className="text-foreground text-lg font-manrope-bold">
                        {correctCount}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View className="w-3 h-3 rounded-full bg-red-500" />
                        <Text className="text-foreground text-sm font-manrope-regular">
                          {t('questions.summary.wrong')}
                        </Text>
                      </View>
                      <Text className="text-foreground text-lg font-manrope-bold">
                        {wrongCount}
                      </Text>
                    </View>

                    <View className="h-px bg-border my-1" />

                    <View className="flex-row items-center justify-between">
                      <Text className="text-foreground text-sm font-manrope-semibold">
                        Total
                      </Text>
                      <Text className="text-foreground text-lg font-manrope-bold">
                        {questions.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="gap-4">
                <TouchableOpacity
                  onPress={handleRestart}
                  className="h-14 rounded-xl items-center justify-center bg-primary"
                >
                  <Text className="text-white text-base font-manrope-semibold">
                    {t('questions.summary.restart')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleGoBack}
                  className="h-14 rounded-xl items-center justify-center bg-card"
                >
                  <Text className="text-foreground text-base font-manrope-semibold">
                    {t('common.back')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="flex-1 px-5 pt-5 gap-6">
              {/* Barra de progresso */}
              <Progress progress={(qIndex + 1) / questions.length} />

              {/* Palavra a ser traduzida */}
              <Text className="text-foreground text-xl font-manrope-bold">
                {q.front}
              </Text>

              {/* Instrução */}
              <Text className="text-foreground text-base font-manrope-regular">
                {t('questions.instruction')}
              </Text>

              {/* Opções de resposta */}
              <View className="gap-3">
                {q.options.map((opt) => {
                  const isSelected = opt === selected
                  const isCorrect = answered && opt === q.back
                  const isWrong = answered && isSelected && opt !== q.back
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => select(opt)}
                      className={`px-5 py-3.5 rounded-xl flex-row items-center ${
                        isCorrect
                          ? 'bg-green-600/20'
                          : isWrong
                          ? 'bg-red-600/20'
                          : 'bg-card'
                      }`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`Opção ${opt}`}
                    >
                      <Text
                        className={`text-sm font-manrope-regular flex-1 ${
                          isCorrect
                            ? 'text-green-600'
                            : isWrong
                            ? 'text-red-600'
                            : 'text-foreground'
                        }`}
                      >
                        {opt}
                      </Text>
                      {isCorrect && <Text className="text-xs text-green-600">✓</Text>}
                      {isWrong && <Text className="text-xs text-red-600">✗</Text>}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}

          {!finished && answered && (
            <View className="px-5 pb-5">
              <TouchableOpacity
                onPress={next}
                className="h-14 rounded-xl items-center justify-center bg-primary"
              >
                <Text className="text-white text-base font-manrope-semibold">
                  {t('common.next')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}
