import { EmptyState } from '@/components/empty-state'
import { Progress } from '@/components/progress'
import { StudySuccess } from '@/components/study/study-success'
import { useCardsByListId } from '@/hooks/use-cards'
import { SealQuestionIcon } from '@/icons'
import { cn } from '@/libs/cn'
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

  if (finished) {
    return (
      <>
        <Stack.Screen options={{ title: t('questions.title') }} />
        <StudySuccess
          title={t('studySuccess.title')}
          description={t('questions.summary.description')}
          highlight={{
            value: `${successRate}%`,
            label: t('questions.summary.successRate'),
          }}
          metrics={[
            {
              label: t('questions.summary.correct'),
              value: correctCount,
              tone: 'success',
            },
            {
              label: t('questions.summary.wrong'),
              value: wrongCount,
              tone: 'danger',
            },
            {
              label: t('studySuccess.total'),
              value: questions.length,
              tone: 'neutral',
            },
          ]}
          restartLabel={t('questions.summary.restart')}
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
        <Stack.Screen options={{ title: `${qIndex + 1}/${questions.length}` }} />

        <View className="flex-1">
          <View className="flex-1 px-5 pt-5 gap-6">
            {/* Barra de progresso */}
            <Progress progress={(qIndex + 1) / questions.length} />

            {/* Palavra a ser traduzida */}
            <Text className="text-foreground text-xl font-manrope-bold">{q.front}</Text>

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
                    className={cn(
                      'px-5 py-3.5 rounded-xl flex-row items-center',
                      isCorrect
                        ? 'bg-green-600/20'
                        : isWrong
                        ? 'bg-red-600/20'
                        : 'bg-card'
                    )}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`Opção ${opt}`}
                  >
                    <Text
                      className={cn(
                        'text-sm font-manrope-regular flex-1',
                        isCorrect
                          ? 'text-green-600'
                          : isWrong
                          ? 'text-red-600'
                          : 'text-foreground'
                      )}
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

          {answered && (
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
